 document.addEventListener('DOMContentLoaded', function() {
            const dropzone = document.getElementById('dropzone');
            const fileInput = document.getElementById('fileInput');
            const uploadBtn = document.getElementById('uploadBtn');
            const adContent = document.getElementById('adContent');
            const uploadedImage = document.getElementById('uploadedImage');
            const placeholderText = document.getElementById('placeholder-text');
            const zoomSlider = document.getElementById('zoomSlider');
            const zoomValue = document.getElementById('zoomValue');
            const rotateLeftBtn = document.getElementById('rotateLeft');
            const rotateRightBtn = document.getElementById('rotateRight');
            const resetBtn = document.getElementById('resetPosition');
            
            let currentZoom = 100;
            let currentRotation = 0;
            let isDragging = false;
            let startX, startY;
            let offsetX = 0, offsetY = 0;
            
            // Manejar selección de archivo
            uploadBtn.addEventListener('click', function() {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', function(e) {
                if (e.target.files.length) {
                    handleFile(e.target.files[0]);
                }
            });
            
            // Manejar drag and drop
            dropzone.addEventListener('dragover', function(e) {
                e.preventDefault();
                dropzone.classList.add('active');
            });
            
            dropzone.addEventListener('dragleave', function() {
                dropzone.classList.remove('active');
            });
            
            dropzone.addEventListener('drop', function(e) {
                e.preventDefault();
                dropzone.classList.remove('active');
                
                if (e.dataTransfer.files.length) {
                    handleFile(e.dataTransfer.files[0]);
                }
            });
            
            // Procesar archivo de imagen
            function handleFile(file) {
                if (!file.type.match('image.*')) {
                    alert('Por favor selecciona un archivo de imagen (JPEG, PNG o WebP)');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    uploadedImage.src = e.target.result;
                    uploadedImage.style.display = 'block';
                    placeholderText.style.display = 'none';
                    resetImagePosition();
                    
                    uploadedImage.onload = function() {
                        positionImage();
                    };
                };
                
                reader.readAsDataURL(file);
            }
            
            // Control de zoom
            zoomSlider.addEventListener('input', function() {
                currentZoom = parseInt(this.value);
                zoomValue.textContent = currentZoom + '%';
                updateImageTransform();
            });
            
            // Controles de rotación
            rotateLeftBtn.addEventListener('click', function() {
                currentRotation -= 90;
                updateImageTransform();
            });
            
            rotateRightBtn.addEventListener('click', function() {
                currentRotation += 90;
                updateImageTransform();
            });
            
            // Reiniciar posición
            resetBtn.addEventListener('click', resetImagePosition);
            
            function resetImagePosition() {
                currentZoom = 100;
                currentRotation = 0;
                offsetX = 0;
                offsetY = 0;
                zoomSlider.value = currentZoom;
                zoomValue.textContent = currentZoom + '%';
                updateImageTransform();
            }
            
            // Posicionar imagen inicialmente
            function positionImage() {
                const containerWidth = adContent.clientWidth;
                const containerHeight = adContent.clientHeight;
                const imgWidth = uploadedImage.naturalWidth;
                const imgHeight = uploadedImage.naturalHeight;
                
                const scale = Math.min(
                    containerWidth / imgWidth,
                    containerHeight / imgHeight
                );
                
                currentZoom = Math.round(scale * 100);
                zoomSlider.value = currentZoom;
                zoomValue.textContent = currentZoom + '%';
                
                updateImageTransform();
            }
            
            // Actualizar transformaciones de la imagen
            function updateImageTransform() {
                const zoomFactor = currentZoom / 100;
                uploadedImage.style.transform = `
                    translate(${offsetX}px, ${offsetY}px)
                    scale(${zoomFactor})
                    rotate(${currentRotation}deg)
                `;
            }
            
            // Funcionalidad de arrastrar
            adContent.addEventListener('mousedown', function(e) {
                if (uploadedImage.src && e.target === uploadedImage) {
                    isDragging = true;
                    startX = e.clientX - offsetX;
                    startY = e.clientY - offsetY;
                    adContent.classList.add('dragging');
                    e.preventDefault();
                }
            });
            
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                
                offsetX = e.clientX - startX;
                offsetY = e.clientY - startY;
                updateImageTransform();
            });
            
            document.addEventListener('mouseup', function() {
                isDragging = false;
                adContent.classList.remove('dragging');
            });
            
            // Soporte para pantallas táctiles
            let touchStartX, touchStartY;
            
            adContent.addEventListener('touchstart', function(e) {
                if (uploadedImage.src) {
                    isDragging = true;
                    const touch = e.touches[0];
                    touchStartX = touch.clientX - offsetX;
                    touchStartY = touch.clientY - offsetY;
                    adContent.classList.add('dragging');
                    e.preventDefault();
                }
            });
            
            document.addEventListener('touchmove', function(e) {
                if (!isDragging) return;
                
                const touch = e.touches[0];
                offsetX = touch.clientX - touchStartX;
                offsetY = touch.clientY - touchStartY;
                updateImageTransform();
                e.preventDefault();
            });
            
            document.addEventListener('touchend', function() {
                isDragging = false;
                adContent.classList.remove('dragging');
            });
        });
   