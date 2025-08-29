// Sistema de sprites mejorado con gráficos de alta calidad
// Sprites en formato base64 para carga inmediata

const GameSprites = {
    // Inicializar sprites
    images: {},
    loaded: false,
    
    // Sprites base64 de alta calidad (estilo pixel art marino)
    sprites: {
        // Nave submarina avanzada del jugador (diseño futurista)
        playerSub: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA2NCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIEN1ZXJwbyBwcmluY2lwYWwgZGUgbGEgbmF2ZSAtLT4KICA8ZWxsaXBzZSBjeD0iMzIiIGN5PSIyNCIgcng9IjI4IiByeT0iMTQiIGZpbGw9IiMyNTY1QTMiIHN0cm9rZT0iIzFBNDU3RCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgCiAgPCEtLSBGcmFuamEgY2VudHJhbCBtZXTDoWxpY2EgLS0+CiAgPHJlY3QgeD0iOCIgeT0iMjIiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0IiBmaWxsPSIjNEE5MEUyIiBvcGFjaXR5PSIwLjciLz4KICAKICA8IS0tIENhYmluYSBwcmluY2lwYWwgLS0+CiAgPGVsbGlwc2UgY3g9IjM2IiBjeT0iMjQiIHJ4PSIxNCIgcnk9IjEwIiBmaWxsPSIjNUFBM0Q2IiBvcGFjaXR5PSIwLjgiLz4KICAKICA8IS0tIFZlbnRhbmFzIGRlIGxhIGNhYmluYSAtLT4KICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjI0IiByPSI0IiBmaWxsPSIjQThEQURDIiBzdHJva2U9IiMzMzY2OTkiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxjaXJjbGUgY3g9IjQyIiBjeT0iMjQiIHI9IjQiIGZpbGw9IiNBOERBREMiIHN0cm9rZT0iIzMzNjY5OSIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgCiAgPCEtLSBBbGV0YXMgZXN0YWJpbGl6YWRvcmFzIC0tPgogIDxwYXRoIGQ9Ik0gMTAgMjQgTCA0IDE0IEwgNCAxOCBMIDggMjQgTCA0IDMwIEwgNCAzNCBMIDEwIDI0IFoiIGZpbGw9IiMxQTQ1N0QiLz4KICAKICA8IS0tIFByb3B1bHNvcmVzIC0tPgogIDxyZWN0IHg9IjIiIHk9IjIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI4IiBmaWxsPSIjNDU3QjlEIiBzdHJva2U9IiMxQTQ1N0QiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxjaXJjbGUgY3g9IjUiIGN5PSIyNCIgcj0iMiIgZmlsbD0iIzc0QzBGQyIgb3BhY2l0eT0iMC44Ii8+CiAgCiAgPCEtLSBDYcOxb25lcyBkZSB0b3JwZWRvcyAtLT4KICA8cmVjdCB4PSI1MCIgeT0iMTgiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzIiBmaWxsPSIjMzM2Njk5IiByeD0iMSIvPgogIDxyZWN0IHg9IjUwIiB5PSIyNyIgd2lkdGg9IjEyIiBoZWlnaHQ9IjMiIGZpbGw9IiMzMzY2OTkiIHJ4PSIxIi8+CiAgCiAgPCEtLSBMdWNlcyBkZSBuYXZlZ2FjacOzbiAtLT4KICA8Y2lyY2xlIGN4PSI1OCIgY3k9IjI0IiByPSIyIiBmaWxsPSIjRkY2QjZCIiBvcGFjaXR5PSIwLjkiLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE4IiByPSIxLjUiIGZpbGw9IiMwMEZBOUEiIG9wYWNpdHk9IjAuOCIvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0iI0ZGNkI2QiIgb3BhY2l0eT0iMC44Ii8+CiAgCiAgPCEtLSBEZXRhbGxlcyBtZXTDoWxpY29zIC0tPgogIDxsaW5lIHgxPSIxNSIgeTE9IjI0IiB4Mj0iNDgiIHkyPSIyNCIgc3Ryb2tlPSIjMUE0NTdEIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC41Ii8+CiAgPGxpbmUgeDE9IjIwIiB5MT0iMTgiIHgyPSI0NCIgeTI9IjE4IiBzdHJva2U9IiMxQTQ1N0QiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiLz4KICA8bGluZSB4MT0iMjAiIHkxPSIzMCIgeDI9IjQ0IiB5Mj0iMzAiIHN0cm9rZT0iIzFBNDU3RCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4=',
        
        // Pez pequeño enemigo (nivel 1-5)
        fishSmall: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACmElEQVRYhb2XTWgTQRTHf7PZbLLZJk2aVqtWRRERD3rwICIeBEU8ePDgwYMgHjyIePAgCIIg4kVEREREPIiIFbEitj5aq22t9dM2TZp87CabyWY3Hprd7OxuNrHVgQezeW/e+8+8N+/NrCCl5H+CAP8ZbMAWYD2wDFgIVAEeQAaGgV7gDfAQuAl0FxKgUIDeFuAUsC7P8RJwDrgqSdJUIQA3A2eBSrvdjtPpxG63o1AoAIjFYkQiESKRCKIoZtN5DJwHHhUC0AtcBdbZ7XYqKyvxeDzYbLZsh2g0Sn9/P319fUSj0WzaQ+AIEMwHUAH4gRVutxuv14vb7c6qS6VSPG/v4MPHDlKpFAA+n4+GhgZsNhu9vb08efKEWCwG8BXYBnywAqgAXgJLKyoqWL58OWq1GoCJiQn8fj/j4+MAKJVKFi1aRH19PSqVCgBRFPH5fDx79oxUKgXAA2CjGUg18Blwl5eXs3LlSlQqFaIo4vf76evrA0ChULBmzRpcLld23MDAAA8ePCAcDgPcAHbmAlQCnwBveXk5K1asQKFQkEwmefXqFQMDAwDU1dWxZMkSVCpVVj0ajXL37l26u1MufAIcT/c7CvQCnrQxAMFgkKdPnzIxMQGkrFq9ejVOpzOj7+joKLdu3WJsbAzgAHCBFqCDVDp4PB5WrFiBQqEgkUjw8uVLBgcHAVi8eDENDQ0ZxgC6urp49OgRkLJ4O1AmpZQEg0E8Hg8tLS0ADA4O8u7dOwCcTidr1qzBZmbv3r3Lly9fkCRJAoaklBIppSQUCkmXLl2SJEmS4vG4dP36dSkSiUiSJEkdHR1SR0eH6diuri7p0qVLUigUygCUTE7x6tUrPB4P69atw+/309eXKjIqKipYunSpaT2YnJzk3r17fP36FaABUGYUi6IoEg6HUSgU6HQ6LBYLBUVCURQJBALEYTQB9QVVGxYbGo0Gq9Wa9/i0DY1GA4DSStGhUChMQ2JUKmSxIf+vv/2/8BOe4gzJRJyGcAAAAABJRU5ErkJggg==',
        
        // Medusa (nivel 6-10)
        jellyfish: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAADFElEQVRYhbWXS2gTURSGv5lJJpNJmjStVq2KIiIuLCxERETEhQsXLly4EMSFKC5cuBDEhSAIgogbERERES8iYkWsiFUfrdW21vqoTZMmzWMymcxkMhkXJjOdyUyaVA8cuMy959z7zzn33HMvgpSS/wkC/xkcwFZgA7ASWAxUAm5ABgaBHuA18BC4CXQWYlAowGAbcBpYn+d4CTgLXJYkaaoQgJuBM0CF3W7H6XRit9tRKBQAxGIxIpEIkUgEURSz6TwCzgEPCwHoBi4D6+12O5WVlbjdbiRJoqenh+7ubiYnJ7Pj6+rqWLx4MQqFgt7eXp48eUIsFlMA24B3VgAVgB9Y4XQ6qa2tZWxsjPb2dnp7e0kmk9n+xcXFNDQ0YLfb6evr48mTJ8RiMYAvwFbggxVABfASWFpWVkZRURGPHz+mp6cn279gwQIaGhpQqVQAiKKIz+fj2bNnpFIpgAfARjOQauAz4C4pKaGjo4OOjo5sf319PUuWLEGlUmXVo9Eod+/epbs75cInwPF0v6NAD+Dx+Xz09vZm1VeuXInT6czoOzo6yq1btxgbGwM4AJynBWhHk/IzMzO0tbVl1desWYPNzN69e5cvX74gSZIEDEkpJVJKSSgUkrq6urLqjY2NUkdHh+nYrq4u6dKlS1IoFMoAlExO8erVKzweD21tbRkAm5qaMqxPY3Jyknv37vH161eABkCZUSyKokg4HEaSJMLhMJDKh/nz55vmQzKZJBwOZ/OhvqBqw2JDo9FQXFyMVqvNe3zahkajAUBppehQKBSmITEqFbLYkP/X3/5f+AmQcQ/qxR8aXAAAAABJRU5ErkJggg==',
        
        // Tiburón (nivel 11-15)
        shark: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAYCAYAAACIhL/AAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADdElEQVRYhb2YS2gTURSGv5lJJpNJmqZptWpVFBFxYWEhIiIiLly4cOHChSAuRHHhwoUgLgRBEETciIiIiHgREStiRax9tFbbWuuj1kdtmjRpHpPJZDIZFyYznclMmlQPHLjMvefce/455557LwIppf8TBP4zOIBtwEZgFbAEqATcgAwMAd3Aa+AhcBPoKsSgUIDeFuA0sCHP8RJwDrgsSdJUIQA3A2eBCrvdjtPpxG63o1AoAIjFYkQiESKRCKIoZtN5BJwHHhYC0A1cBtbb7XYqKytxu91IkkRPTw/d3d1MTk5mx9fV1bF48WIUCgW9vb08efKEWCymALYB76wAKgA/sMLpdFJbW8vY2Bjt7e309vaSTCaz/YuLi2loaMBut9PX18eTJ0+IxWIAX4CtwAcrgArgJbC0rKyMoqIiHj9+TE9PT7Z/wYIFNDQ0oFKpABBFEZ/Px7Nnz0ilUgAPgI1mINXAZ8BdUlJCR0cHHR0d2f76+nqWLFmCSqXKqkejUe7evUt3d8qFT4Dj6X5HgR7A4/P56O3tzaqvXLkSp9OZ0Xd0dJRbt24xNjYGcAA4TwvQjiblZ2ZmaGtry6qvWbMGm5m9e/fu8+XLFyRJkoAhKaVESikJhUJSV1dXVr2xsVHq6OgwHdvV1SVdunRJCoVCGYCSySlevXqFx+Ohra0tA2BTU1OG9WlMTk5y7949vn79CtAAKDOKRVEUCYfDSJJEOBwGUvkwf/580/xMJpOEw+FsPtQXVG1YbGg0GoqLi9FqtXmPT9vQaDQAKK0UHQqFwjQkRqVCFhvy//rb/ws/AUGCCCJhXrCMAAAAAElFTkSuQmCC',
        
        // Pulpo (nivel 16-20)
        octopus: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAADqElEQVRYhbWXW2gTWRjHf2cmk0kmSZOm1apVUUTEhYWFiIiIuHDhwoULF4K4EMWFC0FcCIIgiLgRERERES8iYkWsiFUfrdW21vqoTZMmzWUymcxkMhkXJjOdyUyaVA8cOMx3zvn+3/nOd75zBCkl/xME/jM4gG3ARmAVsASoBNyADAwB3cBr4CFwE+gsxKBQgN424DSwPs/xEnAOuCxJ0lQhADcDZ4EKu92O0+nEbrejUCgAiMViRCIRIpEIoihm03kEnAceFgLQDVwG1tvtdiorK3G73UiSRE9PD93d3UxOTmbH19XVsXjxYhQKBb29vTx58oRYLKYAtgHvrAAqAD+wwul0Ultby9jYGO3t7fT29pJMJrP9i4uLaWhowG6309fXx5MnT4jFYgBfgK3AByuACuAlsLSsrIyioiIeP35MT09Ptn/BggU0NDSgUqkAEEURn8/Hs2fPSKVSAA+AjWYg1cBnwF1SUkJHRwcdHR3Z/vr6epYsWYJKpcqqR6NR7t69S3d3yoVPgOPpfkeBHsDj8/no7e3Nqq9cuRKn05nRd3R0lFu3bjE2NgZwADhPC9COJuVnZmZoa2vLqq9ZswabmX379u0vX74gSZIEDEkpJVJKSSgUkrq6urLqjY2NUkdHh+nYrq4u6dKlS1IoFMoAlExO8erVKzweD21tbRkAm5qaMqxPY3Jyknv37vH161eABkCZUSyKokg4HEaSJMLhMJDKh/nz55vmZzKZJBwOZ/OhvqBqw2JDo9FQXFyMVqvNe3zahkajAUBppehQKBSmITEqFbLYkP/X3/5f+AkAVQ+4TlNXxQAAAABJRU5ErkJggg==',
        
        // Perla/Gema
        pearl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABkElEQVQ4jZWTsUsCYRjGn++7O+/OO0+9tKysLCIiIiIaGhoaGhoaGhqChoagoaEhaGgIGhoagoaGhqCh/6ChoSEiIiIqK6u0PO/u7u7u7hoqK4vqGd/3e3+/930/PgL+GAT8MQzAFmAjsB5YBSwHXIAMDALdwGvgIXAD6MjHQOTh1wHbgdNAfZ7jJeAscEmSpIl8AG4EzgDldrsdu92OzWZDoVAAEI1GCYfDhMNhRFHMpvMQOAs8yAegC7gE1NvtdkpLS3E6nUiSRFdXF52dnYyPj2fH19TUsHLlShQKBd3d3Tx+/JhYLKYANgOvrAAqAB+wxm63U1VVxcjICK2trXR3d5NMJrP9i4qKqK2txWaz0dPTw+PHj4nFYgCfgU3AeysACuAFsMrhcFBcXMy9e/fo6urK9i9evJja2lpUKhUAoiji9Xp5+vQplUoBPADWm4FUAZ8AZ2FhIW1tbbS1tWX7a2pqWLFiBSqVKqseiUS4c+cOnZ0pFz4Cx9L9jgJdgNvr9dLd3Z1VX7t2LXa7PaPv8PAwd+7cYWRkBGAvcJ4m4B0tQCua1L4F4jfKHmBgGgMAAAAASUVORK5CYII=',
        
        // Torpedo/Proyectil
        torpedo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAMCAYAAAB4MH11AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABRElEQVQ4jaWUMUvDQBiGn++SS5pcmqZptWpVFBFxcHBwcHBwcBDEQRAHBwcHQRwEQRBE3ETEiogVseLPqLXa1lof1aZJk+aSy+XiUFtt0qp94YW7+757n7v77kPgj0HAH4MN2AJsBNYAy4FywAXIQD/QCbwEHgLXgbZ8DAoF6G0BTgF1eY6XgDPARUmSJvIBuAE4DZTb7XbsdjsWiwWFQgFANBolHA4TDocRRTGbzkPgNHA/H4BO4AJQb7fbKS0txel0IkkSbW1ttLa2Mj4+nh1fXV3NihUrUCgUtLe38/jxY2KxmALYBLyyAqgAfMAqu91OVVUVI6MjtLS00N7eTjKZzPYvKiqipqYGi8VCR0cHjx8/JhaLAXwGNgLvrQAogBfAcofDQXFxMffv36etrS3bv2TJEmpqalCpVACIoojX6+Xp06dUKgVwD1hnBlIFfAKchYWFNDc309zcnO2vrq5m+fLlqFSqrHokEuHOnTu0tqZc+AgcS/c7CrQBbq/XS3t7e1Z97dq12O32jL7Dw8PcuXOHkZERgL3AeZqAN7QALWhS+xZ8A8PGXOGdcCRgAAAAAElFTkSuQmCC',
        
        // Burbuja
        bubble: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA8ElEQVQ4jaWTMQrCQBBF38xsNptNNokxRhQRsRBBsLCwsLCwsLAQxEIQC0EsBLEQxEIQC0EsBLHwFIJYiIWFhYWFhYVYmGSTTXazFoqKRvTBwMzM+3+GGQb+GAz8MZjAFmAzsA5YBSwDXIAMDALdwGvgIXAD6MjHwOTh1wHbgdNAfZ7jJeAscEmSpIl8AG4EzgDldrsdu92OzWZDoVAAEI1GCYfDhMNhRFHMpvMQOAs8yAegC7gE1NvtdkpLS3E6nUiSRFdXF52dnYyPj2fH19TUsHLlShQKBd3d3Tx+/JhYLKYANgOvrAAqAB+wxm63U1VVxcjICK2trXR3d5NMJrP9RUVFAGxYBtJH5e0FAAAAAElFTkSuQmCC'
    },
    
    // Función para cargar sprites
    loadSprites: function() {
        const promises = [];
        
        for (let key in this.sprites) {
            const img = new Image();
            const promise = new Promise((resolve) => {
                img.onload = () => {
                    this.images[key] = img;
                    resolve();
                };
                img.src = this.sprites[key];
            });
            promises.push(promise);
        }
        
        return Promise.all(promises).then(() => {
            this.loaded = true;
            console.log('Todos los sprites cargados correctamente');
        });
    },
    
    // Función para obtener un sprite
    get: function(name) {
        return this.images[name] || null;
    },
    
    // Función para dibujar un sprite
    draw: function(ctx, name, x, y, angle = 0, scale = 1) {
        const img = this.get(name);
        if (!img) return;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -img.width/2, -img.height/2);
        ctx.restore();
    }
};

// Exportar para uso en el juego
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSprites;
}