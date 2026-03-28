import sys

def main() -> None:
    """
    Prints a professional greeting to the standard output.
    """
    message: str = "Hello, World!"
    sys.stdout.write(f"{message}\n")

if __name__ == "__main__":
    main()