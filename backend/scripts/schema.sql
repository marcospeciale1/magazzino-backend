-- Schema SQL per magazzino_app
-- Tabelle in uso: products, users

-- Table products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codice VARCHAR(100) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descrizione TEXT,
  prezzo DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantita INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed utente di test
INSERT IGNORE INTO users (username, password, email) VALUES ('marco', '1234', 'marco@example.com');

-- Seed prodotti di esempio
INSERT IGNORE INTO products (codice, nome, descrizione, prezzo, quantita) VALUES
('P001', 'Prodotto A', 'Descrizione A', 9.99, 10),
('P002', 'Prodotto B', 'Descrizione B', 19.50, 5);
