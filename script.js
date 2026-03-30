document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('workout-form');
    const tableBody = document.getElementById('workout-table-body');
    const addRowBtn = document.getElementById('add-row-btn');
    const clearBtn = document.getElementById('clear-btn');
    const totalWeightSpan = document.getElementById('total-weight');
    const totalRepsSpan = document.getElementById('total-reps');
    const totalSetsSpan = document.getElementById('total-sets');

    let rowCount = 0;

    // Function to add a new row to the table
    function addRow(exercise = '', weight = '', reps = '', sets = '') {
        rowCount++;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="exercise-input" value="${exercise}" placeholder="e.g., Bench Press"></td>
            <td><input type="number" class="weight-input" value="${weight}" placeholder="0" min="0" step="0.5"></td>
            <td><input type="number" class="reps-input" value="${reps}" placeholder="0" min="0"></td>
            <td><input type="number" class="sets-input" value="${sets}" placeholder="0" min="0"></td>
            <td><button type="button" class="delete-row-btn">Delete</button></td>
        `;
        tableBody.appendChild(row);

        // Add event listeners to the new row inputs
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', updateTotals);
        });

        // Add event listener to the delete button
        const deleteBtn = row.querySelector('.delete-row-btn');
        deleteBtn.addEventListener('click', function() {
            row.remove();
            updateTotals();
        });

        updateTotals();
    }

    // Function to update the totals
    function updateTotals() {
        let totalWeight = 0;
        let totalReps = 0;
        let totalSets = 0;

        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const weightInput = row.querySelector('.weight-input');
            const repsInput = row.querySelector('.reps-input');
            const setsInput = row.querySelector('.sets-input');

            const weight = parseFloat(weightInput.value) || 0;
            const reps = parseInt(repsInput.value) || 0;
            const sets = parseInt(setsInput.value) || 0;

            totalWeight += weight * reps * sets;
            totalReps += reps * sets;
            totalSets += sets;
        });

        totalWeightSpan.textContent = totalWeight.toFixed(1);
        totalRepsSpan.textContent = totalReps;
        totalSetsSpan.textContent = totalSets;
    }

    // Function to clear the form and table
    function clearForm() {
        tableBody.innerHTML = '';
        rowCount = 0;
        updateTotals();
    }

    // Event listener for the "Add Row" button
    addRowBtn.addEventListener('click', function() {
        addRow();
    });

    // Event listener for the "Clear All" button
    clearBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all workouts?')) {
            clearForm();
        }
    });

    // Event listener for form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const rows = tableBody.querySelectorAll('tr');
        if (rows.length === 0) {
            alert('Please add at least one workout before saving.');
            return;
        }

        const workouts = [];
        rows.forEach(row => {
            const exercise = row.querySelector('.exercise-input').value.trim();
            const weight = row.querySelector('.weight-input').value;
            const reps = row.querySelector('.reps-input').value;
            const sets = row.querySelector('.sets-input').value;

            if (exercise) {
                workouts.push({
                    exercise: exercise,
                    weight: weight,
                    reps: reps,
                    sets: sets
                });
            }
        });

        if (workouts.length === 0) {
            alert('Please fill in at least one exercise name.');
            return;
        }

        // In a real application, you would send the data to a server here.
        // For this example, we'll just log it to the console and show an alert.
        console.log('Workouts to save:', workouts);
        alert('Workouts saved! Check the console for the data.');
        clearForm();
    });

    // Initialize with one empty row
    addRow();
});