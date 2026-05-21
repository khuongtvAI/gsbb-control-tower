-- Import 1 dòng vào users_functions
-- Nguồn: templates/_UsersFunctions.xlsx / sheet: UserFunction | 2026-05-21T09:08:46.755Z
-- Chiến lược: ON CONFLICT (username, function_id) DO UPDATE

INSERT INTO public.users_functions (uf_id, function_id, username, user_right)
VALUES
  (725, 10, 'hunguye5', NULL)
ON CONFLICT (username, function_id) DO UPDATE
  SET uf_id      = EXCLUDED.uf_id,
      user_right = EXCLUDED.user_right,
      updated_at = now();
