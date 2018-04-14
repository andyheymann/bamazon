CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	id INTEGER NOT NULL AUTO_INCREMENT,
    prodcut_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price INTEGER(10) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (id)
);


SELECT * FROM products;

INSERT INTO programming_languages (language, rating)
VALUES ('html', 10);

