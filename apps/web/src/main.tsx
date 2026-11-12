import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { colors } from '@anon/design-tokens';
import { blogPosts, type BlogPost, type Product as SharedProduct } from '@anon/types';
import './styles.css';
import './blog.css';

type Product = Pick<SharedProduct, 'id' | 'name' | 'price' | 'image'> & { category: string; old?: number; badge?: string };
const img = (name: string) => `/assets/images/${name}`;
const products: Product[] = [
  { id:'1', name:'Rose Gold Earrings', category:'Jewellery', price:19.99, old:29.99, image:img('products/jewellery-1.jpg'), badge:'Sale' },
  { id:'2', name:'Pure Cotton Shirt', category:'Men’s fashion', price:24.99, old:34.99, image:img('products/shirt-1.jpg') },
  { id:'3', name:'Relaxed Fit Jacket', category:'Men’s fashion', price:39.99, image:img('products/jacket-1.jpg'), badge:'New' },
  { id:'4', name:'Elegant Wrist Watch', category:'Watches', price:49.99, old:59.99, image:img('products/watch-1.jpg'), badge:'Sale' },
  { id:'5', name:'Classic Leather Shoes', category:'Footwear', price:45.00, image:img('products/shoe-1.jpg') },
  { id:'6', name:'Floral Party Dress', category:'Women’s fashion', price:32.00, image:img('products/party-wear-1.jpg') },
  { id:'7', name:'Premium Perfume', category:'Perfume', price:18.00, image:img('products/perfume.jpg') },
  { id:'8', name:'Sports Sneakers', category:'Sports', price:54.00, image:img('products/sports-1.jpg') },
];
const categories = [['Clothes','icons/tee.svg'],['Footwear','icons/shoes.svg'],['Jewellery','icons/jewelry.svg'],['Perfume','icons/perfume.svg'],['Cosmetics','icons/cosmetics.svg'],['Watches','icons/watch.svg']];

function Header({ cart, wishlist }: { cart:number; wishlist:number }) {
  const [query, setQuery] = useState('');
  const nav = useNavigate();
  return <><div className="topbar"><span><b>Free shipping</b> on orders over $55</span><span>Help &nbsp; | &nbsp; USD $</span></div>
    <header><Link className="logo" to="/"><img src={img('logo/logo.svg')} /></Link>
      <form className="search" onSubmit={e=>{e.preventDefault(); nav(`/shop?q=${query}`)}}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products..." /><button>⌕</button></form>
      <nav className="actions"><Link to="/auth" aria-label="Account">♙</Link><Link to="/wishlist">♡<small>{wishlist}</small></Link><Link to="/cart">🛍<small>{cart}</small></Link></nav>
    </header><nav className="nav"><Link to="/">Home</Link><Link to="/shop">Categories</Link><Link to="/shop?deal=true">Deals</Link><Link to="/shop?new=true">New arrivals</Link><Link to="/blog">Blog</Link><Link to="/contact">Contact</Link></nav></>;
}
function ProductCard({ p, onCart, onWish }: { p:Product; onCart:()=>void; onWish:()=>void }) {
  return <article className="product-card"><div className="product-image"><Link to={`/product/${p.id}`}><img src={p.image} alt={p.name}/></Link>{p.badge&&<span className="badge">{p.badge}</span>}<button className="heart" onClick={onWish}>♡</button></div><p className="muted">{p.category}</p><Link className="product-name" to={`/product/${p.id}`}>{p.name}</Link><div className="stars">★★★★★ <span>(24)</span></div><strong>${p.price.toFixed(2)}</strong>{p.old&&<del>${p.old.toFixed(2)}</del>}<button className="add" onClick={onCart}>Add to cart</button></article>;
}
function Home({ onCart, onWish }: {onCart:()=>void;onWish:()=>void}) {
 return <><main><section className="hero"><div><p className="eyebrow">Trending items</p><h1>New fashion<br/><em>arrivals</em></h1><p className="hero-copy">Discover the latest styles made for your everyday moments.</p><Link className="button" to="/shop">Shop now <span>→</span></Link></div></section>
 <section className="section"><div className="section-head"><h2>Shop by category</h2><Link to="/shop">View all →</Link></div><div className="categories">{categories.map(([name,icon])=><Link to={`/shop?category=${name}`} className="category" key={name}><img src={img(icon)}/><b>{name}</b><span>Shop now</span></Link>)}</div></section>
 <section className="section pale"><div className="section-head"><h2>Popular products</h2><Link to="/shop">View all →</Link></div><div className="products">{products.slice(0,4).map(p=><ProductCard key={p.id} p={p} onCart={onCart} onWish={onWish}/>)}</div></section>
 <section className="deal"><div><p className="eyebrow">Deal of the day</p><h2>New season essentials</h2><p>Up to 40% off selected styles. While stocks last.</p><Link className="button dark" to="/shop?deal=true">Shop the deal</Link></div><img src={img('cta-banner.jpg')} /></section>
 <section className="section"><div className="section-head"><h2>What customers say</h2></div><div className="testimonials">{['“Beautiful quality and such a quick delivery. Anon is my new favourite store.”','“The fit guide was perfect. I found exactly what I was looking for.”','“Lovely packaging, lovely products, lovely service.”'].map((x,i)=><div className="quote" key={x}><div className="stars">★★★★★</div><p>{x}</p><b>{['Sarah M.','Jamie R.','Amelia K.'][i]}</b><span>Verified customer</span></div>)}</div></section>
 <BlogSection posts={blogPosts}/>
 <Services/></main></>;
}
function BlogSection({ posts }: { posts: BlogPost[] }) { return <section className="section blog-section"><div className="section-head"><div><p className="eyebrow">From the journal</p><h2>Latest blog posts</h2></div><Link to="/blog">View all →</Link></div><div className="blog-posts">{posts.map(post=><article className="blog-card" key={post.id}><img src={img(post.image.replace('/assets/images/',''))} alt={post.title}/><p className="blog-category">{post.category}</p><h3>{post.title}</h3><p className="blog-excerpt">{post.excerpt}</p><p className="blog-meta">By {post.author} · {post.date}</p></article>)}</div></section> }
function BlogPage() { return <main className="section blog-page"><div className="section-head"><div><p className="eyebrow">Anon journal</p><h1>Stories for your style</h1></div></div><BlogSection posts={blogPosts}/></main> }
function Services(){return <section className="services"><div>🚚<b>Free delivery</b><span>On orders over $55</span></div><div>↩<b>30 day returns</b><span>Shop with confidence</span></div><div>🔒<b>Secure payments</b><span>Your data is protected</span></div><div>☎<b>24/7 support</b><span>Here when you need us</span></div></section>}
function Shop({ onCart,onWish }:{onCart:()=>void;onWish:()=>void}) { return <main className="section shop"><div className="section-head"><div><p className="eyebrow">Our collection</p><h1>All products</h1></div><select><option>Sort: Featured</option><option>Price: low to high</option></select></div><div className="products">{products.map(p=><ProductCard key={p.id} p={p} onCart={onCart} onWish={onWish}/>)}</div></main> }
function ProductPage({onCart}:{onCart:()=>void}) { const {id}=useParams(); const p=products.find(x=>x.id===id)||products[0]; return <main className="section detail"><img src={p.image} alt={p.name}/><div><p className="eyebrow">{p.category}</p><h1>{p.name}</h1><div className="stars">★★★★★ <span>24 reviews</span></div><h2>${p.price.toFixed(2)}</h2><p className="description">A considered everyday essential, made with quality materials and an easy, timeless fit.</p><label>Quantity <input type="number" defaultValue="1" min="1"/></label><button className="button" onClick={onCart}>Add to cart</button><div className="perks">✓ Free delivery over $55<br/>✓ 30-day easy returns</div></div></main> }
function Simple({title, text}:{title:string;text:string}){return <main className="section simple"><p className="eyebrow">Anon</p><h1>{title}</h1><p>{text}</p><Link className="button" to="/shop">Continue shopping</Link></main>}
function Footer(){return <footer><div><img src={img('logo/logo.svg')}/><p>Thoughtful essentials for every day.</p></div><div><b>Shop</b><Link to="/shop">All products</Link><Link to="/shop">New arrivals</Link><Link to="/shop">Best sellers</Link></div><div><b>About</b><Link to="/contact">Contact us</Link><Link to="/blog">Journal</Link><Link to="/auth">My account</Link></div><div><b>Newsletter</b><p>Get 10% off your first order.</p><input placeholder="Your email address"/></div><small>© 2024 Anon. All rights reserved.</small></footer>}
function App(){const [cart,setCart]=useState(0),[wishlist,setWishlist]=useState(0); return <><Header cart={cart} wishlist={wishlist}/><Routes><Route path="/" element={<Home onCart={()=>setCart(x=>x+1)} onWish={()=>setWishlist(x=>x+1)}/>}/><Route path="/shop" element={<Shop onCart={()=>setCart(x=>x+1)} onWish={()=>setWishlist(x=>x+1)}/>}/><Route path="/product/:id" element={<ProductPage onCart={()=>setCart(x=>x+1)}/>}/><Route path="/blog" element={<BlogPage/>}/><Route path="/cart" element={<Simple title="Your cart" text={cart?`${cart} item${cart>1?'s':''} ready for checkout.`:'Your cart is waiting for something special.'}/>}/><Route path="/wishlist" element={<Simple title="Your wishlist" text={wishlist?'Your saved pieces will appear here.':'Save pieces you love as you browse.'}/>}/><Route path="/auth" element={<Simple title="Welcome back" text="Sign in or create an account to see your orders and saved pieces."/>}/><Route path="*" element={<Simple title="Contact" text="Stories, guides and inspiration from Anon."/>}/></Routes><Footer/></>}
createRoot(document.getElementById('root')!).render(<BrowserRouter><App/></BrowserRouter>);
