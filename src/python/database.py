from sqlalchemy import BigInteger, create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Database URL
DATABASE_URL = "postgresql+psycopg://postgres:mashiro@localhost/mydatabase"

# Create SQLAlchemy engine and base class
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Define menu model
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
            'status': self.status,
        }

# Define customer model
class customer(Base):
    __tablename__ = 'daftar_customer'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    birthday = Column(String, nullable=True)
    age = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    email = Column(String, nullable=False, unique=True)
    phone = Column(BigInteger, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    roles_type =  Column(String, nullable=True)
    royalty_point =  Column(BigInteger, nullable=True)

    @property
    def age(self):
        if self.birthday:
            birth_date = datetime.strptime(self.birthday, '%d-%m-%Y')
            today = datetime.today()
            return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        return None

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'birthday': self.birthday,
            'age': self.age,
            'gender': self.gender,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'country': self.country,
            'roles_type': self.roles_type,
            'royalty_point': self.royalty_point,
        }

# Create tables
Base.metadata.create_all(bind=engine)

# Session factory
SessionLocal = sessionmaker(bind=engine)
