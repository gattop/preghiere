-- 002_drop_gospel_log.sql
-- La tabella gospel_log non è più necessaria: la funzione send-daily-gospel
-- invia il vangelo ogni giorno senza controllare se è già stato inviato.
drop table if exists public.gospel_log;
