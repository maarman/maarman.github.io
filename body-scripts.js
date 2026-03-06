/*

Ali Arman - Personal Website
*/

// JavaScript Document

        // Coverflow functionality
        const items = document.querySelectorAll('.coverflow-item');
        const dotsContainer = document.getElementById('dots');
        const currentTitle = document.getElementById('current-title');
        const currentDescription = document.getElementById('current-description');
        const container = document.querySelector('.coverflow-container');
        const menuToggle = document.getElementById('menuToggle');
        const mainMenu = document.getElementById('mainMenu');
        let currentIndex = 3;
        let isAnimating = false;

		// ALWAYS start at Home on refresh
		window.addEventListener('load', () => {
			history.replaceState(null, null, '#home');
			window.scrollTo(0, 0);
		});


        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on menu items (except external links)
        document.querySelectorAll('.menu-item:not(.external)').forEach(item => {
            item.addEventListener('click', (e) => {
                menuToggle.classList.remove('active');
                mainMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target)) {
                menuToggle.classList.remove('active');
                mainMenu.classList.remove('active');
            }
        });

        // Image data with titles and descriptions
        const imageData = [
            {
                title: "Data Fusion",
                description: "Producing more accurate, consistent, and useful information from heterogeneous sources"
            },
            {
                title: "Risk Analysis and Profiling",
                description: "Modeling and pofiling risk of rare events"
            },
            {
                title: "Dynamic Systems Operations",
                description: "How dynamic systems work? How their agents interact? Particularly how traffic flow -motorized and non-motorized- move and interact in transportation networks"
            },
            {
                title: "Behavioral Modeling",
                description: "Understanding and modeling personal decisions"
            },
        ];

        // Create dots
        items.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.onclick = () => goToIndex(index);
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');
        let autoplayInterval = null;
        let isPlaying = true;
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');

        function updateCoverflow() {
            if (isAnimating) return;
            isAnimating = true;

            items.forEach((item, index) => {
                let offset = index - currentIndex;
                
                if (offset > items.length / 2) {
                    offset = offset - items.length;
                }
                else if (offset < -items.length / 2) {
                    offset = offset + items.length;
                }
                
                const absOffset = Math.abs(offset);
                const sign = Math.sign(offset);
                
                let translateX = offset * 220;
                let translateZ = -absOffset * 200;
                let rotateY = -sign * Math.min(absOffset * 60, 60);
                let opacity = 1 - (absOffset * 0.2);
                let scale = 1 - (absOffset * 0.1);

                if (absOffset > 3) {
                    opacity = 0;

                    translateX = sign * 800;
                }

                item.style.transform = `
                    translateX(${translateX}px) 
                    translateZ(${translateZ}px) 
                    rotateY(${rotateY}deg)
                    scale(${scale})
                `;
                item.style.opacity = opacity;
                item.style.zIndex = 100 - absOffset;

                item.classList.toggle('active', index === currentIndex);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });

            const currentData = imageData[currentIndex];
            currentTitle.textContent = currentData.title;
            currentDescription.textContent = currentData.description;
            
            currentTitle.style.animation = 'none';
            currentDescription.style.animation = 'none';
            setTimeout(() => {
                currentTitle.style.animation = 'fadeIn 0.6s forwards';
                currentDescription.style.animation = 'fadeIn 0.6s forwards';
            }, 10);

            setTimeout(() => {
                isAnimating = false;
            }, 1500);
        }

        function navigate(direction) {
            if (isAnimating) return;
            
            currentIndex = currentIndex + direction;
            
            if (currentIndex < 0) {
                currentIndex = items.length - 1;
            } else if (currentIndex >= items.length) {
                currentIndex = 0;
            }
            
            updateCoverflow();
        }

        function goToIndex(index) {
            if (isAnimating || index === currentIndex) return;
            currentIndex = index;
            updateCoverflow();
        }

        // Keyboard navigation
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });

        // Click on items to select
        items.forEach((item, index) => {
            item.addEventListener('click', () => goToIndex(index));
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        let isSwiping = false;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = true;
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            
            const currentX = e.changedTouches[0].screenX;
            const diff = currentX - touchStartX;
            
            if (Math.abs(diff) > 10) {
                e.preventDefault();
            }
        }, { passive: false });

        container.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
            isSwiping = false;
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 30;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
                handleUserInteraction();
                
                if (diffX > 0) {
                    navigate(1);
                } else {
                    navigate(-1);
                }
            }
        }

        // Initialize images and reflections
        items.forEach((item, index) => {
            const img = item.querySelector('img');
            const reflection = item.querySelector('.reflection');
            
            img.onload = function() {

                this.parentElement.classList.remove('image-loading');
                reflection.style.setProperty('--bg-image', `url(${this.src})`);
                reflection.style.backgroundImage = `url(${this.src})`;
                reflection.style.backgroundSize = 'cover';
                reflection.style.backgroundPosition = 'center';
            };
            
            img.onerror = function() {
                this.parentElement.classList.add('image-loading');
            };
        });

        // Autoplay functionality
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % items.length;
                updateCoverflow();
            }, 8000);
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
            isPlaying = false;
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }

        function toggleAutoplay() {
            if (isPlaying) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        }

        function handleUserInteraction() {
            stopAutoplay();
        }

        // Add event listeners to stop autoplay on manual navigation
        items.forEach((item) => {
            item.addEventListener('click', handleUserInteraction);
        });

        document.querySelector('.nav-button.prev').addEventListener('click', handleUserInteraction);
        document.querySelector('.nav-button.next').addEventListener('click', handleUserInteraction);
        
        dots.forEach((dot) => {
            dot.addEventListener('click', handleUserInteraction);
        });

        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                handleUserInteraction();
            }
        });

        // Smooth scrolling and active menu item
        const sections = document.querySelectorAll('.section');
        const menuItems = document.querySelectorAll('.menu-item');
        const header = document.getElementById('header');
        const scrollToTopBtn = document.getElementById('scrollToTop');

        // Update active menu item on scroll
        function updateActiveMenuItem() {
            const scrollPosition = window.scrollY + 100;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    menuItems.forEach(item => {
                        if (!item.classList.contains('external')) {
                            item.classList.remove('active');
                        }
                    });
                    if (menuItems[index] && !menuItems[index].classList.contains('external')) {
                        menuItems[index].classList.add('active');
                    }
                }
            });

            // Header background on scroll
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Show/hide scroll to top button
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', updateActiveMenuItem);

        // Smooth scroll to section
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetId = item.getAttribute('href');
                
                // Check if it's an internal link (starts with #)
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                // External links will open normally in new tab
            });
        });

        // Logo click to scroll to top
        document.querySelector('.logo-container').addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Scroll to top button
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Form submission
        function handleSubmit(event) {
            event.preventDefault();
            alert('Thank you for your message! We\'ll get back to you soon.');
            event.target.reset();
        }

        // Initialize
        updateCoverflow();
        container.focus();
        startAutoplay();


		/* =========================================================
		   Home hero stars and spark points
		   ========================================================= */

		function initHeroGraphic() {
			const hero = document.querySelector('.hero-graphic');
			const canvas = document.getElementById('heroStars');

			if (!hero || !canvas) return;

			const ctx = canvas.getContext('2d');
			let stars = [];
			let animationFrameId = null;

			function resizeCanvas() {
				const rect = hero.getBoundingClientRect();
				const dpr = Math.min(window.devicePixelRatio || 1, 2);

				canvas.width = Math.floor(rect.width * dpr);
				canvas.height = Math.floor(rect.height * dpr);
				canvas.style.width = rect.width + 'px';
				canvas.style.height = rect.height + 'px';

				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

				createStars(rect.width, rect.height);
				createSparkPoints();
			}

			function createStars(width, height) {
				const count = Math.max(90, Math.floor((width * height) / 9000));
				stars = [];

				for (let i = 0; i < count; i += 1) {
					stars.push({
						x: Math.random() * width,
						y: Math.random() * height,
						r: Math.random() * 1.7 + 0.3,
						a: Math.random() * 0.8 + 0.15,
						tw: Math.random() * 0.02 + 0.003
					});
				}
			}

			function drawStars() {
				const width = canvas.clientWidth;
				const height = canvas.clientHeight;

				ctx.clearRect(0, 0, width, height);

				for (const s of stars) {
					s.a += (Math.random() - 0.5) * s.tw;
					if (s.a < 0.12) s.a = 0.12;
					if (s.a > 1) s.a = 1;

					ctx.beginPath();
					ctx.fillStyle = `rgba(255,255,255,${s.a})`;
					ctx.shadowBlur = s.r * 7;
					ctx.shadowColor = 'rgba(202,170,255,0.65)';
					ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
					ctx.fill();
				}

				ctx.shadowBlur = 0;
				animationFrameId = requestAnimationFrame(drawStars);
			}

			function createSparkPoints() {
				hero.querySelectorAll('.spark').forEach(el => el.remove());

				const sparkConfig = [
					{ left: '17%', top: '33%', size: 'sm', dur: '4.2s', delay: '0.4s' },
					{ left: '22%', top: '57%', size: '', dur: '5.1s', delay: '1.1s' },
					{ left: '31%', top: '24%', size: '', dur: '4.8s', delay: '0.6s' },
					{ left: '40%', top: '18%', size: 'sm', dur: '3.9s', delay: '1.7s' },
					{ left: '53%', top: '78%', size: 'lg', dur: '5.6s', delay: '0.3s' },
					{ left: '64%', top: '21%', size: '', dur: '4.6s', delay: '1.4s' },
					{ left: '72%', top: '30%', size: 'sm', dur: '5.4s', delay: '0.8s' },
					{ left: '82%', top: '17%', size: '', dur: '4.1s', delay: '1.2s' },
					{ left: '86%', top: '56%', size: 'lg', dur: '6s', delay: '0.5s' },
					{ left: '14%', top: '86%', size: '', dur: '5.5s', delay: '1.3s' },
					{ left: '34%', top: '90%', size: 'sm', dur: '4.7s', delay: '0.9s' },
					{ left: '76%', top: '86%', size: '', dur: '5.2s', delay: '1.5s' }
				];

				sparkConfig.forEach(cfg => {
					const spark = document.createElement('span');
					spark.className = `spark ${cfg.size}`.trim();
					spark.style.left = cfg.left;
					spark.style.top = cfg.top;
					spark.style.setProperty('--dur', cfg.dur);
					spark.style.setProperty('--delay', cfg.delay);
					hero.appendChild(spark);
				});
			}

			resizeCanvas();
			drawStars();

			let resizeTimer = null;
			window.addEventListener('resize', () => {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(resizeCanvas, 120);
			});

			document.addEventListener('visibilitychange', () => {
				if (document.hidden) {
					cancelAnimationFrame(animationFrameId);
				} else {
					cancelAnimationFrame(animationFrameId);
					drawStars();
				}
			});
		}

		initHeroGraphic();


