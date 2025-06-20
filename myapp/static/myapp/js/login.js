        function showPanel(panelId) {
            const allPanels = document.querySelectorAll('.panel');
            allPanels.forEach(panel => panel.style.display = 'none');
        
            const panelToShow = document.getElementById(panelId);
            if (panelToShow) {
                panelToShow.style.display = 'block';
            }
        
            // Responsive behavior
            const isSmallScreen = window.innerWidth <= 768;
        
            if (isSmallScreen) {
                if (panelId === 'signInPanel' || panelId === 'RegisterPanel') {
                    document.getElementById('loginPanel').style.display = 'none';
                } else if (panelId === 'loginPanel') {
                    document.getElementById('signInPanel').style.display = 'none';
                    document.getElementById('RegisterPanel').style.display = 'none';
                    document.getElementById('loginPanel').style.display = 'block';
                }
            } else {
                // On big screens always keep loginPanel (left-panel) visible
                document.getElementById('loginPanel').style.display = 'block';
            }
        }
        
        // handle resizing (restore left panel on big screen)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.getElementById('loginPanel').style.display = 'block';
            }
        });
        
        document.addEventListener("DOMContentLoaded", function () {
            // Show only left panel on load (big screen)
            showPanel('loginPanel');
        
            // Sign In link
            document.getElementById('showSignIn').addEventListener('click', function (e) {
                e.preventDefault();
                showPanel('signInPanel');
            });
        
            // Register link
            document.getElementById('showRegister').addEventListener('click', function (e) {
                e.preventDefault();
                showPanel('RegisterPanel');
            });
        
            // Password toggle
            const toggles = document.querySelectorAll(".toggle-password");
            toggles.forEach(toggle => {
                toggle.addEventListener("click", function () {
                    const passwordInput = this.previousElementSibling;
                    const isHidden = passwordInput.type === "password";
                    passwordInput.type = isHidden ? "text" : "password";
                    this.classList.toggle("fa-eye", isHidden);
                    this.classList.toggle("fa-eye-slash", !isHidden);
                });
            });
        });

        
        function showMessage(message) {
            const box = document.getElementById('messageBox');
            box.innerText = message;
            box.style.display = 'block';
            setTimeout(() => {
                box.style.display = 'none';
            }, 3000);
        }