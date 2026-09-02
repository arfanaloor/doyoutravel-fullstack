require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const bcrypt = require('bcryptjs');
const db = require('./db');

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const SEED_IMG_DIR = path.join(UPLOADS_DIR, 'seed');
fs.mkdirSync(SEED_IMG_DIR, { recursive: true });

// The six packages that originally shipped hardcoded in the React frontend.
// featuredDates / featuredRoute are only used for the two "Group Fixed
// Departures" hero cards on the homepage.
const DEFAULT_PACKAGES = [
  {
    title: 'Kashmir Summer Escape',
    duration: '5 Days / 4 Nights',
    price: '24,999',
    category: 'Group Fixed',
    region: 'Domestic',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Best Seller', 'Adventure'],
    description: 'Get ready for an unforgettable experience. This package is specially curated to provide the perfect balance of adventure, comfort, and culture across Srinagar, Pahalgam, and Gulmarg.',
    inclusions: ['Return airport transfers', '4-star houseboat & hotel stay', 'Daily breakfast & dinner', 'Shikara ride on Dal Lake', 'All sightseeing as per itinerary'],
    featured: true,
    featuredDates: 'April 15 - April 20',
    featuredRoute: 'Srinagar, Pahalgam, Gulmarg'
  },
  {
    title: 'Dubai Corporate Summit',
    duration: '4 Days / 3 Nights',
    price: 'Custom',
    category: 'MICE',
    region: 'International',
    image: 'https://images.unsplash.com/photo-1512453979436-5a5330171962?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Premium', 'Corporate'],
    description: 'A fully managed corporate offsite in Dubai, covering venue sourcing, delegate logistics, gala dinners, and leadership activities tailored to your team.',
    inclusions: ['Dedicated event manager', '5-star conference venue', 'Airport meet & greet', 'Gala dinner & team activity', 'Custom branding on request'],
    featured: false,
    featuredDates: '',
    featuredRoute: ''
  },
  {
    title: 'Bali Student Adventure',
    duration: '6 Days / 5 Nights',
    price: '35,000',
    category: 'Student',
    region: 'International',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Budget Friendly', 'Action'],
    description: 'Six days of waterfalls, temples, beach clubs, and rice terraces designed for college groups travelling on a budget without cutting corners on safety.',
    inclusions: ['Shared AC accommodation', 'Daily breakfast', 'Airport transfers', 'Water sports session', '24x7 group leader support'],
    featured: false,
    featuredDates: '',
    featuredRoute: ''
  },
  {
    title: 'Rajasthan Heritage Tour',
    duration: '7 Days / 6 Nights',
    price: '28,500',
    category: 'Group Fixed',
    region: 'Domestic',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Culture', 'Popular'],
    description: 'A royal trail through Jaipur, Jodhpur, and Udaipur — forts, palaces, desert camps, and heritage stays that bring Rajasthan\'s history to life.',
    inclusions: ['AC coach travel between cities', 'Heritage hotel stays', 'Daily breakfast & dinner', 'Amer Fort & City Palace entry', 'Desert camp with cultural evening'],
    featured: true,
    featuredDates: 'May 10 - May 16',
    featuredRoute: 'Jaipur, Jodhpur, Udaipur'
  },
  {
    title: 'Goa Weekend Chaos',
    duration: '3 Days / 2 Nights',
    price: '15,500',
    category: 'Student',
    region: 'Domestic',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    tags: ['Beaches', 'Party'],
    description: 'A short, high-energy weekend built around North Goa\'s beaches, beach shacks, and nightlife — perfect for a college group getaway.',
    inclusions: ['Beachside stay', 'Airport/rail transfers', 'One beach party pass', 'Scooter rental assistance'],
    featured: false,
    featuredDates: '',
    featuredRoute: ''
  },
  {
    title: 'Thailand Island Hop',
    duration: '6 Days / 5 Nights',
    price: '42,000',
    category: 'Group Fixed',
    region: 'International',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    tags: ['Tropical', 'Relax'],
    description: 'Island-hop between Phuket and Phi Phi with snorkeling stops, longtail boat tours, and beachfront stays — a relaxed group escape.',
    inclusions: ['Return flights (India-Thailand)', 'Beachfront hotel stay', 'Phi Phi island tour', 'Daily breakfast', 'Visa assistance'],
    featured: false,
    featuredDates: '',
    featuredRoute: ''
  }
];

function slugFromTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function downloadImage(url, destPath, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: timeoutMs }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return downloadImage(res.headers.location, destPath, timeoutMs).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });

    req.on('timeout', () => {
      req.destroy(new Error(`Timed out after ${timeoutMs}ms connecting to ${url}`));
    });

    req.on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function seedAdmin() {
  const existing = db.prepare('SELECT COUNT(*) AS n FROM admins').get();
  if (existing.n > 0) {
    console.log('Admin account already exists, skipping.');
    return;
  }
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(username, hash);
  console.log(`Created admin account "${username}". Log in at /admin/login.`);
}

async function seedPackages() {
  const existing = db.prepare('SELECT COUNT(*) AS n FROM packages').get();
  if (existing.n > 0) {
    console.log('Packages table already has data, skipping package seed.');
    return;
  }

  const shouldDownload = (process.env.DOWNLOAD_SEED_IMAGES || 'false').toLowerCase() === 'true';

  const insert = db.prepare(`
    INSERT INTO packages
      (title, category, region, duration, price, image, tags, description, inclusions, featured, featured_dates, featured_route, sort_order)
    VALUES (@title, @category, @region, @duration, @price, @image, @tags, @description, @inclusions, @featured, @featuredDates, @featuredRoute, @sortOrder)
  `);

  let sortOrder = 0;
  for (const pkg of DEFAULT_PACKAGES) {
    let imageUrl = pkg.image;

    if (shouldDownload) {
      try {
        const ext = '.jpg';
        const filename = `${slugFromTitle(pkg.title)}${ext}`;
        const destPath = path.join(SEED_IMG_DIR, filename);
        console.log(`Downloading image for "${pkg.title}"...`);
        await downloadImage(pkg.image, destPath);
        imageUrl = `/uploads/seed/${filename}`;
        console.log(`  -> saved to ${imageUrl}`);
      } catch (err) {
        console.warn(`  Could not download image for "${pkg.title}" (${err.message}). Keeping the original Unsplash URL instead.`);
      }
    }

    insert.run({
      title: pkg.title,
      category: pkg.category,
      region: pkg.region,
      duration: pkg.duration,
      price: pkg.price,
      image: imageUrl,
      tags: JSON.stringify(pkg.tags),
      description: pkg.description,
      inclusions: JSON.stringify(pkg.inclusions),
      featured: pkg.featured ? 1 : 0,
      featuredDates: pkg.featuredDates,
      featuredRoute: pkg.featuredRoute,
      sortOrder: sortOrder++
    });
  }

  console.log(`Seeded ${DEFAULT_PACKAGES.length} packages.`);
  if (!shouldDownload) {
    console.log('Tip: set DOWNLOAD_SEED_IMAGES=true in backend/.env and re-run "npm run seed" (on a fresh database) to store local copies of these images instead of linking to Unsplash.');
  }
}

async function main() {
  await seedAdmin();
  await seedPackages();
  console.log('Seed complete.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
