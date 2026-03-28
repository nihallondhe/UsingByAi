import sys

def main() -> None:
    """
    Prints a professional greeting to standard output.
    """
    try:
        print("Hello, World!")
    except IOError as e:
        sys.stderr.write(f"An error occurred while writing to stdout: {e}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()