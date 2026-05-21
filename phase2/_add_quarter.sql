-- Tính months và quarter từ ISO week number
-- Công thức: lấy ngày Thursday của tuần đó để xác định tháng/quý
-- Q1=1,2,3 | Q2=4,5,6 | Q3=7,8,9 | Q4=10,11,12

UPDATE public.list_week
SET
  months = EXTRACT(MONTH FROM (
    MAKE_DATE(years::int, 1, 4)
    - (EXTRACT(ISODOW FROM MAKE_DATE(years::int, 1, 4))::int - 1)
    + ((weeks::int - 1) * 7 + 3)
  ))::SMALLINT,
  quarter = CEIL(
    EXTRACT(MONTH FROM (
      MAKE_DATE(years::int, 1, 4)
      - (EXTRACT(ISODOW FROM MAKE_DATE(years::int, 1, 4))::int - 1)
      + ((weeks::int - 1) * 7 + 3)
    )) / 3.0
  )::SMALLINT
WHERE weeks IS NOT NULL AND years IS NOT NULL;

-- Xác nhận kết quả
SELECT years, quarter, months, COUNT(*) AS so_tuan
FROM public.list_week
GROUP BY years, quarter, months
ORDER BY years, quarter, months;