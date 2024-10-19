document.getElementById('motionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the values from the form
    const velocity = parseFloat(document.getElementById('velocity').value);
    const angle = parseFloat(document.getElementById('angle').value);

    // Constants
    const g = 9.81; // Gravity (m/s^2)
    const theta = angle * (Math.PI / 180); // Convert angle to radians
    const v0x = velocity * Math.cos(theta); // Horizontal velocity component
    const v0y = velocity * Math.sin(theta); // Vertical velocity component

    // Calculate important values for projectile motion
    const timeOfAscent = v0y / g; // Time to reach max height
    const timeOfDescent = timeOfAscent; // Symmetric descent time
    const totalTimeOfFlight = timeOfAscent + timeOfDescent; // Total time of flight
    const maxHeight = (v0y ** 2) / (2 * g); // Maximum height
    const horizontalRange = v0x * totalTimeOfFlight; // Horizontal range
    const velocityAtImpact = Math.sqrt(v0x ** 2 + v0y ** 2); // Velocity at the moment of impact

    // Display results
    document.getElementById('timeOfAscent').textContent = `Time of Ascent: ${timeOfAscent.toFixed(2)} s`;
    document.getElementById('timeOfDescent').textContent = `Time of Descent: ${timeOfDescent.toFixed(2)} s`;
    document.getElementById('totalTime').textContent = `Total Time of Flight: ${totalTimeOfFlight.toFixed(2)} s`;
    document.getElementById('maxHeight').textContent = `Maximum Height: ${maxHeight.toFixed(2)} m`;
    document.getElementById('horizontalRange').textContent = `Horizontal Range: ${horizontalRange.toFixed(2)} m`;
    document.getElementById('velocityAtImpact').textContent = `Velocity at Impact: ${velocityAtImpact.toFixed(2)} m/s`;

    // Show the results
    document.getElementById('results').style.display = 'block';

    // Call the function to animate the projectile
    document.getElementById('realTimeUpdates').style.display = 'block'; // Show real-time updates
    animateProjectile(velocity, theta, totalTimeOfFlight, v0x, v0y, g, horizontalRange, maxHeight);
});

function animateProjectile(velocity, theta, totalTime, v0x, v0y, g, horizontalRange, maxHeight) {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'block';

    const fps = 60; // Frames per second
    const dt = 1 / fps; // Time step
    let t = 0;

    // Scaling factors to fit the motion inside the canvas
    const scaleX = canvas.width / (horizontalRange * 1.1); // 1.1 to leave some space
    const scaleY = canvas.height / (maxHeight * 1.5); // 1.5 to leave space for the ground

    // Draw the ground
    const groundY = canvas.height - 10; // Position of the ground

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for each frame

        // Draw the ground
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(canvas.width, groundY);
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Calculate current position of the projectile
        const x = v0x * t;
        const y = v0y * t - 0.5 * g * t * t;

        // If the projectile is still in the air
        if (y >= 0 && t <= totalTime) {
            // Draw the projectile
            ctx.beginPath();
            ctx.arc(x * scaleX, canvas.height - (y * scaleY) - 10, 5, 0, Math.PI * 2); // Adjust y-axis
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();

            // Real-time updates
            const currentVelocity = Math.sqrt(v0x ** 2 + (v0y - g * t) ** 2);
            const currentHeight = y;

            document.getElementById('currentTime').textContent = `Time: ${t.toFixed(2)} s`;
            document.getElementById('currentVelocity').textContent = `Velocity: ${currentVelocity.toFixed(2)} m/s`;
            document.getElementById('currentHeight').textContent = `Height: ${currentHeight.toFixed(2)} m`;

            t += dt; // Update time for the next frame

            requestAnimationFrame(draw); // Continue animation
        }
    }

    draw(); // Start the animation
}
