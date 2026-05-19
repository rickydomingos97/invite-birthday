/**
 * CONVITE DIGITAL PREMIUM - ADEJACI (80 ANOS)
 * Lógica e efeitos visuais interativos.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o sistema de partículas douradas
    initParticles();
    
    // Configura efeitos adicionais nos botões
    initButtonEffects();
});

/* ==========================================================================
   SISTEMA DE PARTÍCULAS DOURADAS (HTML5 CANVAS)
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationId;
    
    // Redimensiona o canvas para preencher a tela inteira
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Ajusta a densidade de partículas com base no tamanho da tela
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 70);
        createParticles(particleCount);
    }
    
    // Classe representando uma faísca/partícula dourada
    class Particle {
        constructor() {
            this.reset(true); // Inicializa em posições aleatórias da tela na primeira carga
        }
        
        reset(isInitialLoad = false) {
            this.x = Math.random() * canvas.width;
            // Se for carga inicial, espalha na tela toda. Senão, surge de baixo para subir.
            this.y = isInitialLoad ? Math.random() * canvas.height : canvas.height + Math.random() * 20;
            this.size = Math.random() * 2.5 + 0.5; // tamanhos variados
            this.speedX = Math.random() * 0.4 - 0.2; // leve oscilação lateral
            this.speedY = -(Math.random() * 0.5 + 0.15); // velocidade de subida suave
            
            // Opacidade e pulsação
            this.opacity = Math.random() * 0.5 + 0.1;
            this.alphaSpeed = Math.random() * 0.005 + 0.002;
            this.fadingIn = true;
            this.maxOpacity = Math.random() * 0.6 + 0.2;
            
            // Matiz levemente variado entre ouro clássico e ouro rosé pálido
            const colors = [
                'rgba(243, 229, 171, ', // Ouro Suave
                'rgba(212, 175, 55, ',  // Ouro Clássico
                'rgba(255, 235, 205, ', // Marfim/Branco Quente
                'rgba(224, 169, 109, '  // Ouro Rosé
            ];
            this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Controle de brilho oscilante (fade in e fade out orgânico)
            if (this.fadingIn) {
                this.opacity += this.alphaSpeed;
                if (this.opacity >= this.maxOpacity) {
                    this.fadingIn = false;
                }
            } else {
                this.opacity -= this.alphaSpeed;
            }
            
            // Reseta a partícula se ela sumir (opacity <= 0) ou sair do topo da tela
            if (this.y < -10 || this.opacity <= 0 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset(false);
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.colorPrefix + this.opacity + ')';
            
            // Efeito de brilho de luz sutil para partículas maiores
            if (this.size > 1.5) {
                ctx.shadowBlur = this.size * 3;
                ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.fill();
        }
    }
    
    // Cria as instâncias de partículas
    function createParticles(count) {
        particlesArray = [];
        for (let i = 0; i < count; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Loop de animação
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Remove sombras globais temporariamente para melhorar a performance
        ctx.shadowBlur = 0;
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Gerencia o redimensionamento da janela de forma otimizada
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            cancelAnimationFrame(animationId);
            resizeCanvas();
            animate();
        }, 150);
    });
    
    // Inicialização direta
    resizeCanvas();
    animate();
}

/* ==========================================================================
   EFEITOS INTERATIVOS DOS BOTÕES
   ========================================================================== */
function initButtonEffects() {
    const btnRsvp = document.getElementById('btn-rsvp');
    
    if (btnRsvp) {
        // Adiciona um efeito dinâmico extra de partículas sob demanda ao clicar
        btnRsvp.addEventListener('click', (e) => {
            // Efeito visual sutil de pulso ao toque/clique no botão
            btnRsvp.style.transform = 'scale(0.96)';
            setTimeout(() => {
                btnRsvp.style.transform = '';
            }, 100);
            
            // Cria um mini flash dourado na área do botão para confirmação tátil premium
            createRippleEffect(e, btnRsvp);
        });
    }
}

// Cria um ripple dourado elegante na posição do clique
function createRippleEffect(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.background = 'rgba(255, 255, 255, 0.4)';
    ripple.style.borderRadius = '50%';
    ripple.style.left = `${x - 50}px`;
    ripple.style.top = `${y - 50}px`;
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple-animation 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    // Estiliza o ripple no documento
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    element.appendChild(ripple);
    
    // Remove o elemento após a animação terminar
    setTimeout(() => {
        ripple.remove();
        style.remove();
    }, 600);
}
