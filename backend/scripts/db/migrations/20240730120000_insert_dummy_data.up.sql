-- Insert dummy data for stores
INSERT INTO stores (id, name, prefecture, city, street) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'ダミー店舗A', '東京都', '千代田区', '丸の内1-1-1'),
    ('a0000000-0000-0000-0000-000000000002', 'ダミー店舗B', '大阪府', '大阪市', '北区梅田2-2-2');

-- Insert dummy data for flyers
INSERT INTO flyers (id, image_data) VALUES
    ('b0000000-0000-0000-0000-000000000001', '\xDEADBEEF'),
    ('b0000000-0000-0000-0000-000000000002', '\xCAFEBABE');

-- Insert dummy data for campaigns
INSERT INTO campaigns (id, flyer_id, name, start_date, end_date) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '夏のキャンペーン', '2024-07-01', '2024-07-31'),
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', '秋のキャンペーン', '2024-09-01', '2024-09-30');

-- Insert dummy data for campaign_stores
INSERT INTO campaign_stores (campaign_id, store_id) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002'),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001');

-- Insert dummy data for products
INSERT INTO products (id, name, category) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'りんご', 'フルーツ'),
    ('d0000000-0000-0000-0000-000000000002', '牛乳', '乳製品');

-- Insert dummy data for flyer_items
INSERT INTO flyer_items (id, campaign_id, product_id, price_excluding_tax, price_including_tax, unit, restriction_note) VALUES
    ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 100, 110, '個', 'お一人様3個まで'),
    ('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 200, 220, '本', NULL);