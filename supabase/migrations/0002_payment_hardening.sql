-- ============================================================================
-- BBVF — payment reconciliation hardening
--
-- The first migration required *some* verified payment event before a donation
-- could become 'succeeded'. That is too weak: one verified event would have
-- unlocked every donation. This migration ties the evidence to the donation's
-- own reference, so each credit needs its own verified event.
-- ============================================================================

alter table payment_events
  add column if not exists donation_reference text;

create index if not exists payment_events_reference_idx
  on payment_events (donation_reference);

create or replace function guard_donation_state()
returns trigger
language plpgsql
as $$
begin
  if new.state = 'succeeded' and old.state is distinct from 'succeeded' then
    if not exists (
      select 1 from payment_events
      where signature_verified
        and processed_at is not null
        and provider = new.provider
        and donation_reference = new.reference
    ) then
      raise exception
        'A donation cannot be marked succeeded without its own verified, processed payment event';
    end if;
  end if;
  return new;
end;
$$;

-- Refunds may never exceed the amount that was actually captured.
create or replace function guard_refund_total()
returns trigger
language plpgsql
as $$
declare
  captured numeric(14, 2);
  already_refunded numeric(14, 2);
begin
  select amount into captured from donations where id = new.donation_id;
  select coalesce(sum(amount), 0) into already_refunded
  from refunds where donation_id = new.donation_id;

  if captured is null then
    raise exception 'Refund must reference an existing donation';
  end if;
  if already_refunded + new.amount > captured then
    raise exception 'Refunds cannot exceed the captured donation amount';
  end if;
  return new;
end;
$$;

drop trigger if exists refunds_total_guard on refunds;
create trigger refunds_total_guard
before insert on refunds
for each row execute function guard_refund_total();
