export function utils() {
    // Updates the time display for all elements with the class "current-time"
    function updateTime() {
        const now = new Date();

        // Format day name
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = days[now.getDay()];

        // Format date as dd-mm-yyyy
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        // Format time as hh:mm:ss AM/PM
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        // Full formatted date-time string
        const formattedTime = `${dayName}, ${day}-${month}-${year}, ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;

        // Update all elements with the formatted time
        document.querySelectorAll(".current-time").forEach(el => {
            el.textContent = formattedTime;
        });
    }

    // Set initial time and update every second
    updateTime();
    setInterval(updateTime, 1000);
}
