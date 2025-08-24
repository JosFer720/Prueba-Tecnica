CREATE DATABASE IF NOT EXISTS pruebatecnica;
USE pruebatecnica;

DROP TABLE IF EXISTS fx_rate_gt;
CREATE TABLE fx_rate_gt (
    rate_date DATE PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    usd_gtq DECIMAL(10,5) NOT NULL,
    compra DECIMAL(10,5) NULL,
    fetched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS weather_gt;
CREATE TABLE weather_gt (
    weather_date DATE NOT NULL,
    location_key VARCHAR(40) NOT NULL,
    lat DECIMAL(8,5) NOT NULL,
    lon DECIMAL(8,5) NOT NULL,
    temp_c DECIMAL(5,2) NOT NULL,
    feels_c DECIMAL(5,2) NULL,
    humidity_pct INT NULL,
    conditions VARCHAR(80) NULL,
    description VARCHAR(120) NULL,
    provider VARCHAR(50) NOT NULL,
    fetched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (weather_date, location_key)
);