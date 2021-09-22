let sql = `SELECT a.id, c.restaurant_id, c.section_name, b.item_name, a.item_price, a.item_desc, a.item_note
FROM md_item_description a, md_items b, md_section c, md_menu d
WHERE a.item_id=b.id
AND a.section_id = c.id
AND a.menu_id = d.id`