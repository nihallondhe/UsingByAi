import math

def calculate_area(radius):
    return math.pi * (radius ** 2)

if __name__ == "__main__":
    try:
        user_radius = float(input("Enter the radius of the circle: "))
        if user_radius < 0:
            print("Radius cannot be negative.")
        else:
            area = calculate_area(user_radius)
            print(f"The area of the circle with radius {user_radius} is: {area}")
    except ValueError:
        print("Invalid input. Please enter a numeric value.")