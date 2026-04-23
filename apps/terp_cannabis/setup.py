from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

setup(
    name="terp_cannabis",
    version="0.1.0",
    description="THCA wholesale cannabis ERP — built on ERPNext",
    author="Evan Tenenbaum",
    author_email="evan@evanmail.com",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires,
)
