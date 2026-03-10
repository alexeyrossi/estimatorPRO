ALTER TABLE estimates
  ALTER COLUMN final_volume TYPE numeric USING final_volume::numeric,
  ALTER COLUMN net_volume TYPE numeric USING net_volume::numeric,
  ALTER COLUMN truck_space_cf TYPE numeric USING truck_space_cf::numeric;
