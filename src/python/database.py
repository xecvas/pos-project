from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL
DATABASE_URL = "postgresql+psycopg://postgres:mashiro@localhost/mydatabase"

# Create a SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Define the Product model
class menu(Base):
    __tablename__ = 'daftar_menu'
    
    id = Column(Integer, primary_key=True)
    nama_menu = Column(String, nullable=False)
    kode = Column(String, nullable=False, unique=True)
    kategori = Column(String, nullable=False)
    sub_kategori = Column(String, nullable=False)
    harga = Column(Integer, nullable=False)
    status = Column(String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nama_menu': self.nama_menu,
            'kode': self.kode,
            'kategori': self.kategori,
            'sub_kategori': self.sub_kategori,
            'harga': self.harga,
            'status':  self.status,
        }

# Create all tables if they don't exist
Base.metadata.create_all(bind=engine)

# Session factory
SessionLocal = sessionmaker(bind=engine)
