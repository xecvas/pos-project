export function utils() {
    function updateTime() {
        const timeElements = document.querySelectorAll(".current-time"); // Select all elements with the class
        const now = new Date();
    
        // Format nama hari
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = days[now.getDay()];
    
        // Format tanggal menjadi dd-mm-yyyy
        const day = String(now.getDate()).padStart(2, '0'); // Pad with zero if single digit
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const year = now.getFullYear();
    
        // Format waktu menjadi hh:mm:ss AM/PM
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM
    
        hours = hours % 12 || 12; // Convert to 12-hour format; 0 becomes 12
    
        const formattedTime = `${dayName}, ${day}-${month}-${year}, ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    
        // Update all elements
        timeElements.forEach((timeElement) => {
            timeElement.textContent = formattedTime;
        });
    }
    
    // Update the time every second
    setInterval(updateTime, 1000);
    
    // Set the initial time immediately
    updateTime();    
}