// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const elementsWithLang = document.querySelectorAll('[data-es], [data-en]');
    const pdfButton = document.getElementById('download-pdf');
    const previewButton = document.getElementById('preview-pdf');
    const pdfLoading = document.getElementById('pdf-loading');
    
    // Default language is Spanish
    let currentLang = 'es';
    
    // Language switching function
    function switchLanguage(targetLang) {
        currentLang = targetLang;
        
        // Update active button
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === targetLang) {
                btn.classList.add('active');
            }
        });
        
        // Update all elements with language data
        elementsWithLang.forEach(element => {
            const text = element.getAttribute(`data-${targetLang}`);
            if (text) {
                element.textContent = text;
            }
        });
        
        // Update document title
        const titles = {
            'es': 'Federico González Cima - Software Technical Leader',
            'en': 'Federico González Cima - Software Technical Leader'
        };
        document.title = titles[targetLang];
        
        // Update document language
        document.documentElement.lang = targetLang;
        
        // Store language preference in localStorage
        localStorage.setItem('preferredLanguage', targetLang);
        
        // Add smooth transition effect
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 150);
    }
    
    // Enhanced PDF Download functionality
    function downloadPDF() {
        // Show loading indicator
        pdfLoading.style.display = 'flex';
        
        // Get the CV content
        const cvContent = document.getElementById('cv-content');
        
        console.log('📥 Starting download using working test approach...');
        
        // Create container using EXACTLY the same approach as the working test
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = cvContent.outerHTML;
        
        // Apply the EXACT same fixes that work in the test
        fixPDFPositionAndColors(tempContainer);
        
        // Apply same positioning as test
        tempContainer.style.cssText = `
            position: static;
            width: 800px;
            max-width: 800px;
            background: white;
            margin: 0 auto;
            color: #333;
            font-family: Arial, sans-serif;
            padding: 0;
        `;
        
        document.body.appendChild(tempContainer);
        
        // Use SAME options as the working test
        const options = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `CV_Federico_Gonzalez_Cima_${currentLang.toUpperCase()}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { 
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: 800,
                height: tempContainer.offsetHeight || 1000
            },
            jsPDF: { 
                unit: 'in', 
                format: 'letter', 
                orientation: 'portrait' 
            }
        };
        
        // Generate PDF using SAME method as working test
        html2pdf().set(options).from(tempContainer).save().then(() => {
            console.log('✅ Download PDF generated successfully');
            
            // Clean up
            document.body.removeChild(tempContainer);
            pdfLoading.style.display = 'none';
            
            // Show success message
            showNotification(
                currentLang === 'es' ? 'PDF descargado exitosamente!' : 'PDF downloaded successfully!',
                'success'
            );
            
        }).catch(error => {
            console.error('❌ Error generating download PDF:', error);
            
            // Clean up
            if (document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
            }
            pdfLoading.style.display = 'none';
            
            showNotification('❌ Error generando PDF: ' + error.message, 'error');
        });
    }
    
    // Apply PDF-specific styles to improve rendering
    function applyPDFStyles(element) {
        // Hide elements that shouldn't appear in PDF
        const elementsToHide = element.querySelectorAll('.top-controls, .pdf-loading');
        elementsToHide.forEach(el => el.style.display = 'none');
        
        // Ensure proper font sizes and spacing for PDF
        const sections = element.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.pageBreakInside = 'avoid';
            section.style.marginBottom = '20pt';
        });
        
        // Fix header styling for PDF
        const header = element.querySelector('.header');
        if (header) {
            header.style.background = '#667eea';
            header.style.webkitPrintColorAdjust = 'exact';
            header.style.printColorAdjust = 'exact';
            header.style.color = '#ffffff';
        }
        
        // Fix skill tags for PDF
        const skillTags = element.querySelectorAll('.skill-tag');
        skillTags.forEach(tag => {
            tag.style.background = '#e0f2fe';
            tag.style.color = '#0369a1';
            tag.style.webkitPrintColorAdjust = 'exact';
            tag.style.printColorAdjust = 'exact';
            tag.style.border = '1px solid #7dd3fc';
        });
        
        // Fix timeline items
        const timelineItems = element.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.style.pageBreakInside = 'avoid';
            item.style.marginBottom = '15pt';
        });
        
        // Ensure proper image sizing
        const images = element.querySelectorAll('img');
        images.forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });
        
        // Fix body styles for PDF
        element.style.background = '#ffffff';
        element.style.color = '#333333';
        element.style.fontSize = '12pt';
        element.style.lineHeight = '1.4';
        element.style.fontFamily = '"Inter", "Helvetica Neue", Arial, sans-serif';
    }
    
    // Show notification function
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // Add event listeners to language buttons
    langButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetLang = this.dataset.lang;
            if (targetLang !== currentLang) {
                switchLanguage(targetLang);
            }
        });
    });
    
    // Add event listener to PDF download button
    if (pdfButton) {
        pdfButton.addEventListener('click', function(e) {
            e.preventDefault();
            downloadPDF();
        });
    }
    
    // Add event listener to PDF preview button
    if (previewButton) {
        previewButton.addEventListener('click', function(e) {
            e.preventDefault();
            previewPDF();
        });
    }
    
    // Fix PDF positioning and color issues
    function fixPDFPositionAndColors(element) {
        console.log('🔧 Applying comprehensive PDF fixes...');
        
        // 1. Reset root element positioning and ensure proper layout
        element.style.cssText = `
            position: static !important;
            left: 0 !important;
            top: 0 !important;
            right: auto !important;
            bottom: auto !important;
            transform: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: none !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #333333 !important;
            font-family: Arial, Helvetica, sans-serif !important;
            font-size: 14px !important;
            line-height: 1.4 !important;
            box-sizing: border-box !important;
        `;
        
        // 2. Fix all containers to prevent left shift
        const containers = element.querySelectorAll('.container, .content-grid, .profile-section');
        containers.forEach(container => {
            container.style.cssText = `
                position: static !important;
                left: 0 !important;
                right: 0 !important;
                top: auto !important;
                bottom: auto !important;
                transform: none !important;
                margin: 0 auto !important;
                padding: 0 20px !important;
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
                display: block !important;
            `;
        });
        
        // 3. Fix header with strong color enforcement
        const headers = element.querySelectorAll('.header');
        headers.forEach(header => {
            header.style.cssText = `
                background: #667eea !important;
                background-color: #667eea !important;
                color: #ffffff !important;
                padding: 40px 20px !important;
                position: static !important;
                left: 0 !important;
                right: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                box-sizing: border-box !important;
                display: block !important;
            `;
        });
        
        // 4. Fix ALL text colors explicitly - this is crucial
        const allTextElements = element.querySelectorAll('*');
        allTextElements.forEach(el => {
            const tagName = el.tagName.toLowerCase();
            
            // Skip non-text elements
            if (['script', 'style', 'img', 'svg', 'input', 'button'].includes(tagName)) {
                return;
            }
            
            // Set colors based on context
            if (el.closest('.header')) {
                el.style.color = '#ffffff !important';
            } else if (el.classList.contains('skill-tag')) {
                el.style.color = '#0369a1 !important';
                el.style.backgroundColor = '#e0f2fe !important';
            } else if (el.classList.contains('section-title')) {
                el.style.color = '#1e293b !important';
            } else {
                el.style.color = '#333333 !important';
            }
        });
        
        // 5. Fix specific elements with problematic positioning
        const elementsToFix = element.querySelectorAll('.left-column, .right-column, .timeline, .skills-grid');
        elementsToFix.forEach(el => {
            el.style.cssText = `
                position: static !important;
                left: 0 !important;
                right: 0 !important;
                transform: none !important;
                width: 100% !important;
                margin: 0 0 30px 0 !important;
                padding: 0 !important;
                display: block !important;
                box-sizing: border-box !important;
            `;
        });
        
        // 6. Force all backgrounds and colors with extreme specificity
        const stylesToForce = `
            * { color: #333333 !important; }
            .header * { color: #ffffff !important; }
            .skill-tag { 
                background-color: #e0f2fe !important; 
                color: #0369a1 !important; 
                border: 1px solid #7dd3fc !important;
            }
            .section-title { color: #1e293b !important; }
            .name { color: #ffffff !important; }
            .title { color: rgba(255, 255, 255, 0.95) !important; }
            .contact-item { color: rgba(255, 255, 255, 0.9) !important; }
            .job-title { color: #1e293b !important; }
            .company { color: #6b7280 !important; }
        `;
        
        // Create and inject critical styles
        const styleElement = document.createElement('style');
        styleElement.textContent = stylesToForce;
        element.appendChild(styleElement);
        
        console.log('✅ PDF fixes applied successfully');
        return element;
    }
    
    // Test function to debug PDF issues
    function testPDF() {
        console.log('🧪 Testing PDF generation with positioning and color fixes...');
        
        // Create a simple test content that's VISIBLE
        const testContent = document.createElement('div');
        testContent.innerHTML = `
            <div style="background: white; padding: 40px; font-family: Arial, sans-serif; color: #333;">
                <div style="background: #667eea; color: white; padding: 30px; margin-bottom: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0 0 10px 0; font-size: 28px;">PDF Test - Color & Position Fix</h1>
                    <p style="color: white; margin: 0; font-size: 16px;">Testing header colors and positioning</p>
                </div>
                
                <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 22px;">Content Positioning Test</h2>
                <p style="font-size: 16px; line-height: 1.5; margin-bottom: 15px; color: #333;">
                    This test verifies that content is NOT shifted to the left and colors are visible.
                </p>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
                    <h3 style="color: #1f2937; margin-bottom: 15px;">Diagnostic Information</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #333;">
                        <li style="color: #333; margin-bottom: 5px;">Generated: ${new Date().toLocaleString()}</li>
                        <li style="color: #333; margin-bottom: 5px;">Language: ${currentLang}</li>
                        <li style="color: #333; margin-bottom: 5px;">Screen: ${window.innerWidth}x${window.innerHeight}</li>
                        <li style="color: #333; margin-bottom: 5px;">User Agent: ${navigator.userAgent.split(' ').slice(-2).join(' ')}</li>
                    </ul>
                </div>
                
                <div style="display: flex; gap: 15px; margin: 20px 0;">
                    <div style="background: #e0f2fe; color: #0369a1; padding: 10px 15px; border-radius: 15px; border: 1px solid #7dd3fc;">
                        Skill Tag Test
                    </div>
                    <div style="background: #dcfce7; color: #166534; padding: 10px 15px; border-radius: 15px; border: 1px solid #bbf7d0;">
                        Color Test
                    </div>
                    <div style="background: #fef3c7; color: #92400e; padding: 10px 15px; border-radius: 15px; border: 1px solid #fde68a;">
                        Background Test
                    </div>
                </div>
                
                <div style="border-left: 4px solid #3b82f6; padding-left: 20px; margin: 30px 0;">
                    <h4 style="color: #1e293b; margin: 0 0 10px 0;">Position Check</h4>
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">
                        If this text appears aligned to the left edge (not shifted right), 
                        the positioning fix is working correctly.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 8px;">
                    <h3 style="color: #059669; margin: 0 0 10px 0;">✅ Test Results</h3>
                    <p style="color: #333; margin: 0; font-size: 14px;">
                        If you can see all colors and text is properly positioned, the fixes are working!
                    </p>
                </div>
            </div>
        `;
        
        // Apply comprehensive fixes
        fixPDFPositionAndColors(testContent);
        
        // Make it visible during capture
        testContent.style.cssText = `
            position: static;
            width: 800px;
            max-width: 800px;
            background: white;
            margin: 0 auto;
            color: #333;
            font-family: Arial, sans-serif;
            padding: 0;
        `;
        
        // Temporarily add to body for capture
        document.body.appendChild(testContent);
        
        const options = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'Test_PDF_Color_Position_Fixed.pdf',
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { 
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: 800,
                height: testContent.offsetHeight || 1000
            },
            jsPDF: { 
                unit: 'in', 
                format: 'letter', 
                orientation: 'portrait' 
            }
        };
        
        html2pdf().set(options).from(testContent).save().then(() => {
            console.log('✅ Color and position test PDF generated successfully');
            showNotification('✅ Test PDF generated! Check colors and positioning', 'success');
            
            // Clean up
            document.body.removeChild(testContent);
        }).catch(error => {
            console.error('❌ Error generating test PDF:', error);
            showNotification('❌ Test PDF failed: ' + error.message, 'error');
            
            // Clean up
            if (document.body.contains(testContent)) {
                document.body.removeChild(testContent);
            }
        });
    }
    
    // Load preferred language from localStorage
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
        switchLanguage(savedLang);
    }
    
    // Keyboard shortcuts for language switching and PDF download
    document.addEventListener('keydown', function(e) {
        // Alt + E for Spanish (Español)
        if (e.altKey && e.key === 'e') {
            e.preventDefault();
            switchLanguage('es');
        }
        // Alt + N for English
        if (e.altKey && e.key === 'n') {
            e.preventDefault();
            switchLanguage('en');
        }
        // Ctrl + P or Cmd + P for PDF download
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            downloadPDF();
        }
        // Ctrl + Shift + P or Cmd + Shift + P for PDF preview
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            previewPDF();
        }
    });
    
    // Smooth scrolling for internal links (if any are added later)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add fade-in animation on page load
    function addFadeInAnimation() {
        const sections = document.querySelectorAll('.section');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }
    
    // Initialize animations
    addFadeInAnimation();
    
    // Print functionality (fallback for older browsers)
    function setupPrintFallback() {
        // If html2pdf is not available, use browser print
        if (typeof html2pdf === 'undefined') {
            pdfButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.print();
            });
        }
    }
    
    setupPrintFallback();
    
    // PDF Preview functionality - using the SAME approach as the working test
    function previewPDF() {
        console.log('🔍 Starting PDF preview using working test approach...');
        
        // Show loading indicator
        pdfLoading.style.display = 'flex';
        
        // Get the CV content
        const cvContent = document.getElementById('cv-content');
        if (!cvContent) {
            console.error('❌ CV content not found!');
            pdfLoading.style.display = 'none';
            showNotification('Error: CV content not found', 'error');
            return;
        }
        
        console.log('✅ CV content found, creating clone with same method as test...');
        
        // Create container using EXACTLY the same approach as the working test
        const pdfContainer = document.createElement('div');
        pdfContainer.innerHTML = cvContent.outerHTML;
        
        // Apply the EXACT same fixes that work in the test
        fixPDFPositionAndColors(pdfContainer);
        
        // Apply same positioning as test
        pdfContainer.style.cssText = `
            position: static;
            width: 800px;
            max-width: 800px;
            background: white;
            margin: 0 auto;
            color: #333;
            font-family: Arial, sans-serif;
            padding: 0;
        `;
        
        // Temporarily add to body for capture (same as test)
        document.body.appendChild(pdfContainer);
        
        const options = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `CV_Federico_Gonzalez_Cima_${currentLang.toUpperCase()}_Preview.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { 
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: 800,
                height: pdfContainer.offsetHeight || 1000
            },
            jsPDF: { 
                unit: 'in', 
                format: 'letter', 
                orientation: 'portrait' 
            }
        };
        
        html2pdf().set(options).from(pdfContainer).output('blob').then(function(pdfBlob) {
            console.log('✅ Preview PDF generated successfully');
            console.log('📊 PDF blob size:', pdfBlob.size, 'bytes');
            
            // Clean up
            document.body.removeChild(pdfContainer);
            pdfLoading.style.display = 'none';
            
            if (pdfBlob.size === 0) {
                console.error('❌ PDF blob is empty!');
                showNotification('Error: PDF vacío generado', 'error');
                return;
            }
            
            // Create object URL for the PDF blob
            const pdfUrl = URL.createObjectURL(pdfBlob);
            console.log('🔗 PDF URL created for preview');
            
            // Show simple preview
            showSimplePDFPreview(pdfBlob, pdfUrl);
            
        }).catch(error => {
            console.error('❌ Error generating preview PDF:', error);
            
            // Clean up
            if (document.body.contains(pdfContainer)) {
                document.body.removeChild(pdfContainer);
            }
            pdfLoading.style.display = 'none';
            
            showNotification('❌ Error generando preview: ' + error.message, 'error');
        });
    }
    
    // Function to optimize content for PDF generation
    function optimizeContentForPDF(element) {
        console.log('🔧 Optimizing content for PDF...');
        
        // Remove or hide problematic elements
        const elementsToHide = element.querySelectorAll('.top-controls, .pdf-loading');
        elementsToHide.forEach(el => {
            if (el) el.style.display = 'none';
        });
        
        // Fix images - replace with placeholder if needed
        const images = element.querySelectorAll('img');
        console.log(`🖼️ Processing ${images.length} images`);
        images.forEach((img, index) => {
            if (img.src && img.src.includes('unsplash')) {
                console.log(`Image ${index}: External image found, creating placeholder`);
                // Create a placeholder for external images that might fail to load
                const placeholder = document.createElement('div');
                placeholder.style.cssText = `
                    width: ${img.offsetWidth || 150}px;
                    height: ${img.offsetHeight || 150}px;
                    background: #e5e7eb;
                    border: 2px solid #d1d5db;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6b7280;
                    font-size: 14px;
                    text-align: center;
                `;
                placeholder.textContent = '👤';
                img.parentNode.replaceChild(placeholder, img);
            } else {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });
        
        // Simplify complex backgrounds and gradients
        const header = element.querySelector('.header');
        if (header) {
            header.style.background = '#667eea';
            header.style.backgroundImage = 'none';
            console.log('📐 Simplified header background');
        }
        
        // Ensure proper spacing and sizing
        const sections = element.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.pageBreakInside = 'avoid';
            section.style.marginBottom = '20px';
        });
        
        // Fix any flex layouts that might cause issues
        const flexElements = element.querySelectorAll('*');
        flexElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.display === 'flex') {
                el.style.display = 'block';
            }
        });
        
        console.log('✅ Content optimization complete');
    }
    
    // Simple PDF preview display
    function showSimplePDFPreview(pdfBlob, pdfUrl) {
        console.log('🎯 Showing simple PDF preview...');
        
        const downloadUrl = URL.createObjectURL(pdfBlob);
        
        // Try opening directly first
        const directWindow = window.open(pdfUrl, '_blank');
        
        if (directWindow) {
            console.log('✅ PDF opened directly in new tab');
            showNotification(
                currentLang === 'es' ? 'PDF abierto en nueva pestaña!' : 'PDF opened in new tab!',
                'success'
            );
            
            // Also provide download option
            setTimeout(() => {
                if (confirm(currentLang === 'es' ? 
                    '¿Quieres descargar el PDF también?' : 
                    'Do you want to download the PDF as well?')) {
                    
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = `CV_Federico_Gonzalez_${currentLang.toUpperCase()}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
            }, 1000);
            
        } else {
            console.log('❌ Direct window opening failed, showing modal');
            showPDFModal(pdfBlob, pdfUrl, downloadUrl);
        }
        
        // Clean up URLs after 30 seconds
        setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
            URL.revokeObjectURL(downloadUrl);
        }, 30000);
    }
    
    // Fallback modal for PDF display
    function showPDFModal(pdfBlob, pdfUrl, downloadUrl) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                <h2 style="color: #1e293b; margin-bottom: 15px; font-size: 24px;">
                    ${currentLang === 'es' ? '📄 PDF Generado' : '📄 PDF Generated'}
                </h2>
                <p style="color: #64748b; margin-bottom: 25px; font-size: 16px;">
                    ${currentLang === 'es' ? 
                        'Tu CV ha sido generado exitosamente.' : 
                        'Your CV has been generated successfully.'}
                </p>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
                    📊 Tamaño: ${(pdfBlob.size / 1024).toFixed(1)} KB
                </p>
                
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
                    <a href="${downloadUrl}" download="CV_Federico_Gonzalez_${currentLang.toUpperCase()}.pdf" 
                       style="background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-weight: 500;"
                       onclick="console.log('📥 Download triggered');">
                        📥 ${currentLang === 'es' ? 'Descargar' : 'Download'}
                    </a>
                    <button onclick="openPDFDirect('${pdfUrl}')" 
                            style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-weight: 500;">
                        🚀 ${currentLang === 'es' ? 'Ver PDF' : 'View PDF'}
                    </button>
                </div>
                
                <button onclick="closeModal()" 
                        style="background: #6b7280; color: white; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; font-size: 14px;">
                    ✕ ${currentLang === 'es' ? 'Cerrar' : 'Close'}
                </button>
            </div>
        `;
        
        // Add modal functions
        window.openPDFDirect = function(url) {
            console.log('🔗 Opening PDF in new tab from modal...');
            const newWindow = window.open(url, '_blank');
            if (!newWindow) {
                alert(currentLang === 'es' ? 
                    'Por favor permite popups para ver el PDF' : 
                    'Please allow popups to view the PDF');
            } else {
                console.log('✅ PDF opened successfully');
            }
        };
        
        window.closeModal = function() {
            console.log('🔒 Closing modal...');
            modal.remove();
            delete window.openPDFDirect;
            delete window.closeModal;
        };
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                window.closeModal();
            }
        });
        
        document.body.appendChild(modal);
        
        showNotification(
            currentLang === 'es' ? 'PDF listo para descargar!' : 'PDF ready to download!',
            'success'
        );
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Utility function to detect user's preferred language
function detectUserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('es')) {
        return 'es';
    } else {
        return 'en';
    }
}

// Set initial language based on browser preference if no saved preference
if (!localStorage.getItem('preferredLanguage')) {
    const detectedLang = detectUserLanguage();
    localStorage.setItem('preferredLanguage', detectedLang);
} 