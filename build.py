import os
import shutil
import json
import glob
from pathlib import Path

# Configuration
DIST_DIR = 'dist'
PACKAGE_DIR = 'package'
INCLUDED_FILES = ['package.json', 'README.md', 'LICENSE.md', '.npmignore']
SUPPORTED_DECLARATION_EXTENSIONS = ['*.d.ts', '*.d.mts']


def log(message, level="INFO"):
    """Log messages with levels."""
    print(f"[{level}] {message}")


def ensure_directory(directory):
    """Ensure a directory exists."""
    if not os.path.exists(directory):
        os.mkdir(directory)
        log(f"Created directory: {directory}", level="SUCCESS")
    else:
        log(f"Directory already exists: {directory}")


def copy_included_files():
    """Copy essential files like package.json, README.md, and LICENSE.md."""
    for file in INCLUDED_FILES:
        if os.path.exists(file):
            destination = os.path.join(PACKAGE_DIR, file)
            if not os.path.exists(destination):
                shutil.copy(file, PACKAGE_DIR)
                log(f"Copied {file} to {PACKAGE_DIR}")
            else:
                # Ensure the existing file in the package folder is updated
                with open(file, 'r') as source_file:
                    content = source_file.read()
                with open(destination, 'w') as dest_file:
                    dest_file.write(content)
                log(f"Updated {file} in {PACKAGE_DIR}")
        else:
            log(f"File not found: {file}", level="WARNING")


def clean_package_json():
    """Remove 'scripts' section from package.json."""
    package_json_path = os.path.join(PACKAGE_DIR, 'package.json')
    if os.path.exists(package_json_path):
        with open(package_json_path, 'r') as file:
            package_json = json.load(file)

        if 'scripts' in package_json:
            del package_json['scripts']
            with open(package_json_path, 'w') as file:
                json.dump(package_json, file, indent=2)
            log("'scripts' section removed from package.json")
        else:
            log("'scripts' section not found in package.json")
    else:
        log("package.json not found in package directory", level="ERROR")


def move_declaration_files():
    """Move all declaration files (*.d.ts, *.d.mts) to the package root."""
    for pattern in SUPPORTED_DECLARATION_EXTENSIONS:
        files = glob.glob(f"{PACKAGE_DIR}/{DIST_DIR}/**/{pattern}", recursive=True)
        for file in files:
            file_path = Path(file)
            destination = Path(PACKAGE_DIR) / file_path.name
            shutil.move(file, destination)
            log(f"Moved {file} to {destination}")

    # Remove empty directories in the dist folder after moving files
    for root, dirs, _ in os.walk(DIST_DIR, topdown=False):
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)
            if not os.listdir(dir_path):
                os.rmdir(dir_path)
                log(f"Removed empty directory: {dir_path}")


def copy_dist_directory():
    """Copy the dist directory to the package directory."""
    destination = os.path.join(PACKAGE_DIR, DIST_DIR)
    if os.path.exists(destination):
        shutil.rmtree(destination)  
        log(f"Removed existing {destination}")
    shutil.copytree(DIST_DIR, destination)
    log(f"Copied {DIST_DIR} to {PACKAGE_DIR}")


def build():
    """Run the build process."""
    log("Starting build process...")

    # Step 1: Prepare the package directory
    ensure_directory(PACKAGE_DIR)

    # Step 2: Copy the dist directory
    copy_dist_directory()

    # Step 3: Copy included files
    copy_included_files()

    # Step 4: Clean package.json
    clean_package_json()

    # Step 5: Move declaration files
    move_declaration_files()

    log("Build process completed successfully!", level="SUCCESS")


if __name__ == '__main__':
    build()
