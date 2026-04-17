import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, Plus, Minus, Menu } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tastingNotes: string[];
  originStory: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Single-Origin Cacao 72%",
    description: "Ethically sourced from the high altitudes of Ecuador.",
    price: 24.00,
    image: "https://images.unsplash.com/photo-1614088685112-0a860f714e5a?w=800&q=80",
    tastingNotes: ["Dark Cherry", "Toasted Oak", "Velvet finish"],
    originStory: "Harvested by hand from shade-grown cacao trees in the Guayas River basin. Carefully fermented and sun-dried to preserve its intense, fruity character."
  },
  {
    id: 2,
    name: "Cold-Pressed Olive Oil",
    description: "First harvest Picual olives from Andalucia.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
    tastingNotes: ["Green Tomato", "Artichoke", "Peppery finish"],
    originStory: "Pressed within 4 hours of harvest to capture the vibrant, grassy notes of early autumn. Unfiltered and naturally settled for a pristine pour."
  },
  {
    id: 3,
    name: "Aged Balsamic Reserve",
    description: "Aged 12 years in oak and cherry wood barrels.",
    price: 58.00,
    image: "https://images.unsplash.com/photo-1592398460619-faeb86b72a6b?w=800&q=80",
    tastingNotes: ["Fig", "Molasses", "Woodsmoke"],
    originStory: "A traditional Modenese recipe, passed down through generations. The slow evaporation concentrates the flavors into a dense, complex nectar."
  },
  {
    id: 4,
    name: "Rare White Tea",
    description: "Silver Needle buds hand-picked in the early spring.",
    price: 32.00,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cbf9?w=800&q=80",
    tastingNotes: ["Honeydew", "White Flora", "Crisp finish"],
    originStory: "Plucked only during the brief window of early spring in Fujian. The tender buds are gently withered in the sun, creating an incredibly delicate and sweet infusion."
  },
  {
    id: 5,
    name: "Truffle Sea Salt",
    description: "Fleur de Sel blended with black summer truffles.",
    price: 28.00,
    image: "https://images.unsplash.com/photo-1627993414995-1f91da6fd73a?w=800&q=80",
    tastingNotes: ["Earthy", "Umami", "Oceanic"],
    originStory: "Hand-harvested French sea salt meets aromatic open-wood truffles. A simple finishing touch that transforms any dish into a culinary masterpiece."
  },
  {
    id: 6,
    name: "Vintage Port Jelly",
    description: "Rich, deeply flavored preserve for artisan cheeses.",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1502014822147-1aed56ad40bc?w=800&q=80",
    tastingNotes: ["Plum", "Spiced Berry", "Warm Vanilla"],
    originStory: "Crafted using a family recipe with a vintage port reduction. The perfect balance of sweetness and acidity to complement sharp, aged cheeses."
  }
];

interface CartItem extends Product {
  qty: number;
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Scroll listener for nav
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Modal key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { ...product, qty }];
    });
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const updateCartQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutComplete(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-ivory overflow-x-hidden font-sans">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 h-20 bg-brand-black/95 border-b border-brand-gold/20 flex items-center justify-between px-6 lg:px-[60px]">
        <div className="font-serif text-[32px] tracking-[0.1em] uppercase cursor-pointer text-brand-ivory">Élume</div>
        <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.2em] text-brand-gold">
          <a href="#collection" className="hover:text-brand-ivory transition-colors cursor-pointer">Collection</a>
          <a href="#story" className="hover:text-brand-ivory transition-colors cursor-pointer">Our Story</a>
          <a href="#contact" className="hover:text-brand-ivory transition-colors cursor-pointer">Contact</a>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-2 hover:text-brand-gold transition-colors text-brand-ivory font-sans text-[14px]">
          <span className="uppercase text-[11px] tracking-[0.2em] text-brand-gold hidden sm:block mr-2">Cart</span>
          <ShoppingCart size={20} strokeWidth={1.5} className="text-brand-gold" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-black font-bold text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Main Grid Layout (Theme match) */}
      <main className="w-full pt-20 lg:pt-0 lg:h-screen flex flex-col lg:grid lg:grid-cols-[55%_45%] overflow-hidden">
        
        {/* Hero Section */}
        <section className="relative h-[60vh] lg:h-full w-full flex flex-col justify-end p-10 lg:p-[60px] lg:pt-[120px] pb-10 lg:pb-[80px]">
          <div className="absolute inset-0 z-0 bg-brand-black">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-black/60 to-brand-black/20 mix-blend-multiply"></div>
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80" 
              alt="Hero Background" 
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="relative z-10 text-brand-ivory animate-fade-up">
            <p className="text-[14px] uppercase tracking-[0.3em] mb-10 text-brand-gold font-sans">
              The Poetry of Provenance
            </p>
            <h1 className="font-serif text-[42px] md:text-[64px] font-light leading-[1.1] mb-[40px] tracking-tight">
              Curated Artifacts<br className="hidden md:block" />for the Epicurean
            </h1>
            <a href="#collection" className="inline-block w-[220px] p-[16px] text-center border border-brand-gold text-brand-gold uppercase text-[11px] tracking-[0.2em] hover:bg-brand-gold hover:text-brand-black transition-all duration-400">
              Explore the collection
            </a>
          </div>
        </section>

        {/* Collection Section */}
        <section id="collection" className="h-auto lg:h-full lg:overflow-y-auto bg-[#121210] p-6 lg:p-[40px_60px] pb-[80px]">
          <div className="flex justify-between items-end mb-[30px] lg:mt-[80px]" data-reveal>
            <h2 className="font-serif text-[28px] font-light italic text-brand-ivory">Featured Editions</h2>
            <span className="text-[11px] text-brand-gold uppercase tracking-[0.1em] cursor-pointer hover:text-brand-ivory transition-colors">View All</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-[40px]">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="group flex flex-col bg-brand-black border border-brand-gold/10 p-[15px] cursor-pointer transition-colors hover:border-brand-gold/30" onClick={() => { setSelectedProduct(product); setModalQty(1); }} data-reveal>
                <div className="w-full aspect-square bg-cover bg-center mb-[15px] border border-brand-gold/10 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-[18px] font-light mb-1 text-brand-ivory">{product.name}</h3>
                <div className="text-brand-gold font-serif text-[16px] mb-3">${product.price.toFixed(2)}</div>
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                  className="mt-auto bg-transparent border border-brand-gold text-brand-ivory text-[10px] uppercase tracking-[0.1em] p-[8px] hover:bg-brand-gold hover:text-brand-black transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Two Column Structure / Story & Contact */}
      <section id="story" className="bg-brand-black py-[120px] border-t border-brand-gold/10">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div data-reveal>
            <h2 className="font-serif text-[32px] font-light italic mb-8 text-brand-gold">Our Heritage</h2>
            <div className="space-y-6 text-[14px] leading-relaxed text-brand-ivory/80 font-light">
              <p>
                Élume was born from a singular obsession: to unearth the world's most exceptional culinary treasures and bring them to the modern table. We travel to hidden valleys and ancient estates, partnering directly with artisans who have dedicated literal generations to perfecting their craft.
              </p>
              <p>
                Our philosophy is rooted in patience. The slow fermentation of cacao, the careful aging of balsamic in centuries-old barrels, the meticulous hand-harvesting of sea salt at dawn — these processes cannot be rushed. They require an inherent respect for time and raw material.
              </p>
              <p>
                Every offering in our collection represents the pinnacle of its category. When you experience Élume, you are tasting a narrative of dedication, tradition, and an unwavering commitment to quality that transcends the ordinary.
              </p>
            </div>
          </div>
          
          <div id="contact" data-reveal>
            <h2 className="font-serif text-[32px] font-light italic mb-8 text-brand-gold">Inquiries</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" placeholder="NAME" required className="w-full bg-transparent border-b border-brand-gold/20 pb-2 text-[12px] tracking-widest uppercase focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-ivory/40 text-brand-ivory" />
              </div>
              <div>
                <input type="email" placeholder="EMAIL" required className="w-full bg-transparent border-b border-brand-gold/20 pb-2 text-[12px] tracking-widest uppercase focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-ivory/40 text-brand-ivory" />
              </div>
              <div>
                <textarea rows={4} placeholder="MESSAGE" required className="w-full bg-transparent border-b border-brand-gold/20 pb-2 text-[12px] tracking-widest uppercase focus:outline-none focus:border-brand-gold transition-colors resize-none placeholder:text-brand-ivory/40 text-brand-ivory"></textarea>
              </div>
              <button type="submit" className="border border-brand-gold text-brand-gold px-8 py-3 text-[11px] uppercase tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all duration-400">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Strip from Theme */}
      <div className="h-10 bg-brand-black border-t border-brand-gold/10 flex items-center justify-center text-[10px] text-brand-ivory/40 tracking-[0.1em] uppercase">
        © {new Date().getFullYear()} Élume Artisans — Established in the spirit of heritage
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-12">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedProduct(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-[#121210] border border-brand-gold/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl shadow-brand-black/50 animate-fade-up">
            <button 
              className="absolute top-4 right-4 z-10 text-brand-ivory/50 hover:text-brand-gold transition-colors"
              onClick={() => setSelectedProduct(null)}
            >
              <X size={24} strokeWidth={1} />
            </button>
            
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto border-r border-brand-gold/10">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="font-serif text-[32px] md:text-[42px] leading-tight mb-2 text-brand-ivory">{selectedProduct.name}</h2>
              <div className="font-serif text-[24px] text-brand-gold mb-8">${selectedProduct.price.toFixed(2)}</div>
              
              <div className="mb-8">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-brand-ivory/50 mb-3 border-b border-brand-gold/10 pb-2 flex justify-between">
                  Tasting Notes <span className="text-brand-gold">❖</span>
                </h4>
                <ul className="space-y-2 mt-4">
                  {selectedProduct.tastingNotes.map((note, i) => (
                    <li key={i} className="text-[14px] text-brand-ivory/80 flex items-center font-light">
                      <span className="w-1 h-1 bg-brand-gold mr-4"></span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-10">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-brand-ivory/50 mb-3 border-b border-brand-gold/10 pb-2">Provenance</h4>
                <p className="text-[14px] leading-relaxed text-brand-ivory/70 font-light mt-4">{selectedProduct.originStory}</p>
              </div>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="flex items-center border border-brand-gold/30 h-12 bg-brand-black/50">
                  <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="px-4 text-brand-ivory/50 hover:text-brand-gold transition-colors">
                    <Minus size={14} strokeWidth={1} />
                  </button>
                  <span className="w-8 text-center text-[14px] text-brand-ivory">{modalQty}</span>
                  <button onClick={() => setModalQty(modalQty + 1)} className="px-4 text-brand-ivory/50 hover:text-brand-gold transition-colors">
                    <Plus size={14} strokeWidth={1} />
                  </button>
                </div>
                <button 
                  onClick={() => addToCart(selectedProduct, modalQty)}
                  className="flex-1 border border-brand-gold text-brand-gold h-12 text-[11px] uppercase tracking-[0.1em] hover:bg-brand-gold hover:text-brand-black transition-all duration-400"
                >
                  Add to Cart — ${(selectedProduct.price * modalQty).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <div className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-400 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}>
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-brand-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-400 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsCartOpen(false)}
        ></div>
        
        {/* Drawer */}
        <div className={`absolute top-0 right-0 h-full w-full md:w-[480px] bg-[#121210] shadow-2xl shadow-brand-black pointer-events-auto transform transition-transform duration-400 ease-out flex flex-col border-l border-brand-gold/20 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-brand-gold/10">
            <h2 className="font-serif text-[24px] text-brand-ivory italic">Curated Selection</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-brand-ivory/50 hover:text-brand-gold transition-colors">
              <X size={24} strokeWidth={1} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {checkoutComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-up">
                <div className="w-16 h-16 border border-brand-gold rounded-full flex items-center justify-center mb-6 text-brand-gold">
                  <span className="font-serif text-2xl italic">É</span>
                </div>
                <h3 className="font-serif text-[28px] mb-2 text-brand-ivory">Gratitude.</h3>
                <p className="text-brand-ivory/60 text-[14px]">Your requisition has been secured.</p>
                <button 
                  onClick={() => { setCheckoutComplete(false); setIsCartOpen(false); }}
                  className="mt-8 border border-brand-gold text-brand-gold px-8 py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-brand-gold hover:text-brand-black transition-all"
                >
                  Return to Collection
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-brand-ivory/30 text-[12px] uppercase tracking-[0.2em]">
                The collection is empty
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 mb-6 bg-brand-black border border-brand-gold/10 p-3">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover border border-brand-gold/10" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-[16px] leading-tight pr-4 text-brand-ivory">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-brand-ivory/40 hover:text-brand-gold transition-colors"><X size={14} strokeWidth={1.5}/></button>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-brand-gold/20 h-8">
                          <button onClick={() => updateCartQty(item.id, -1)} className="px-2 text-brand-ivory/50 hover:text-brand-gold"><Minus size={12}/></button>
                          <span className="w-6 text-center text-[12px] text-brand-ivory font-light">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} className="px-2 text-brand-ivory/50 hover:text-brand-gold"><Plus size={12}/></button>
                        </div>
                        <div className="font-serif text-[16px] text-brand-gold">${(item.price * item.qty).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-8 mt-8 border-t border-brand-gold/10">
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-brand-ivory/50">Subtotal</span>
                    <span className="font-serif text-[28px] leading-none text-brand-gold">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <form onSubmit={handleCheckout} className="space-y-4 bg-brand-black p-6 border border-brand-gold/10">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] mb-4 text-brand-gold">Requisition Details</h3>
                    <input type="text" placeholder="FULL NAME" required className="w-full bg-transparent border-b border-brand-gold/20 pb-2 text-[11px] tracking-[0.1em] text-brand-ivory focus:outline-none focus:border-brand-gold placeholder:text-brand-ivory/30" />
                    <input type="email" placeholder="EMAIL ADDRESS" required className="w-full bg-transparent border-b border-brand-gold/20 pb-2 text-[11px] tracking-[0.1em] text-brand-ivory focus:outline-none focus:border-brand-gold placeholder:text-brand-ivory/30 mt-4" />
                    <input type="text" placeholder="SHIPPING ESTATE" required className="w-full bg-transparent border-b border-brand-gold/20 pb-2 text-[11px] tracking-[0.1em] text-brand-ivory focus:outline-none focus:border-brand-gold placeholder:text-brand-ivory/30 mt-4" />
                    <div className="relative mt-4">
                      <input type="text" placeholder="CARD NUMBER" pattern="[0-9]*" minLength={16} maxLength={16} required className="w-full bg-transparent border-b border-brand-gold/20 pb-2 text-[11px] tracking-[0.1em] text-brand-ivory focus:outline-none focus:border-brand-gold placeholder:text-brand-ivory/30" />
                    </div>
                    <button type="submit" className="w-full border border-brand-gold text-brand-gold py-4 mt-6 text-[10px] uppercase tracking-[0.2em] hover:bg-brand-gold hover:text-brand-black transition-colors duration-400">
                      Commit Requisition
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
