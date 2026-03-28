#!/usr/bin/env python3
"""
Professional Hello World Script

This module serves as a template for professional Python scripting,
incorporating best practices such as entry point protection, 
type hinting, and standard documentation.
"""

import sys
import logging

# Configure logging to provide status updates
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

def say_hello(name: str = "World") -> None:
    """
    Prints a greeting message to the standard output.

    Args:
        name (str): The name of the entity to greet. Defaults to "World".
    """
    try:
        greeting = f"Hello, {name}!"
        print(greeting)
        logging.info("Greeting executed successfully.")
    except Exception as e:
        logging.error(f"Failed to execute greeting: {e}")
        sys.exit(1)

def main() -> None:
    """
    Main execution logic.
    """
    say_hello()

if __name__ == "__main__":
    main()