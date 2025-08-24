USE pruebatecnica;

INSERT INTO fx_rate_gt (rate_date, provider, usd_gtq, compra)
VALUES ('2025-08-20', 'banguat', 7.8050, 7.7550)
ON DUPLICATE KEY UPDATE
usd_gtq = VALUES(usd_gtq),
compra = VALUES(compra),
fetched_at = CURRENT_TIMESTAMP;

INSERT INTO weather_gt (weather_date, location_key, lat, lon, temp_c, feels_c, humidity_pct, conditions, description, provider)
VALUES ('2025-08-20', 'antigua', 14.5575, -90.7333, 23.4, 24.0, 70, 'Clouds', 'overcast clouds', 'openweathermap')
ON DUPLICATE KEY UPDATE
lat = VALUES(lat),
lon = VALUES(lon),
temp_c = VALUES(temp_c),
feels_c = VALUES(feels_c),
humidity_pct = VALUES(humidity_pct),
conditions = VALUES(conditions),
description = VALUES(description),
fetched_at = CURRENT_TIMESTAMP;