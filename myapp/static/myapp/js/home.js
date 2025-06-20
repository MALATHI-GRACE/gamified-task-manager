        const quotes = [
            "Growth begins where your comfort zone ends, Small steps every day lead to monumental change.",
            "Knowledge is power, but applying it is even more powerful.",
            "Success is the sum of small efforts, repeated day in and day out.",
            "Every skill you learn contributes to the strength of your journey.",
            "Creativity is intelligence having fun – let it flow."
        ];

        let quoteIndex = 0;
        setInterval(() => {
            const quoteDisplay = document.getElementById('quoteDisplay');
            quoteDisplay.textContent = quotes[quoteIndex];
            quoteIndex = (quoteIndex + 1) % quotes.length; // Cycle through quotes
        }, 5000); // Change quote every 5 seconds


        setTimeout(() => {
            const message = document.querySelector('.message');
            if (message) {
                message.remove();
            }
        }, 3000);  // Remove after fadeout completes
        
        const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get("show_login_alert") === "true") {
                alert("Please log in to access this page.");
                // Remove the param from URL to prevent repeated alerts
                urlParams.delete("show_login_alert");
                const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
                window.history.replaceState({}, '', newUrl);
            }                     