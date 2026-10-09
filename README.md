# AutoBridge — Inventory Website

This version keeps the original AutoBridge catalogue design and replaces the demo/test vehicles with the inventory imported from `Inventory(1).xlsx`.

## Inventory imported

- 93 vehicles
- 11 marques
- Excel fields included in the website data:
  - Make
  - Model
  - Variant/equipment text
  - Registration
  - Mileage
  - Power
  - Fuel
  - Inventory price
  - Final price
- The catalogue filters, search, sorting, saved cars and vehicle detail pages remain in place.

## Run locally

No build step is required.

1. Extract the ZIP.
2. Open `index.html` in a browser.

For the best local experience, run a small local server from the extracted folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## How to add vehicle pictures

The website is already prepared for one photo per vehicle.

### 1. Put the photos in this folder

Inside the extracted website, open:

```text
assets/cars/
```

You will see a `README.txt` there.

Add your photos with these exact filenames:

```text
1.jpg
2.jpg
3.jpg
...
93.jpg
```

The number matches the vehicle's `id` in `data.js`.

For example:

```text
assets/
  cars/
    1.jpg
    2.jpg
    3.jpg
    4.jpg
    ...
    93.jpg
```

### 2. Match the number to the correct car

Open:

```text
data.js
```

At the top of every vehicle record you will see an `id` and an `image` field.

Example:

```js
{
  "id": 1,
  "make": "Rolls-Royce",
  "model": "Cullinan",
  ...
  "image": "assets/cars/1.jpg"
}
```

That means:

```text
assets/cars/1.jpg
```

is the photo for vehicle #1.

Vehicle #2 uses:

```text
assets/cars/2.jpg
```

and so on.

### 3. If you want different filenames

You do not have to use numbered filenames. You can change the `image` value directly in `data.js`.

For example, change:

```js
"image": "assets/cars/1.jpg"
```

to:

```js
"image": "assets/cars/rolls-royce-cullinan-2025.jpg"
```

Then put that file at:

```text
assets/cars/rolls-royce-cullinan-2025.jpg
```

The same path is used automatically on the catalogue card and the vehicle detail page.

### 4. Supported image formats

JPG is recommended:

```text
.jpg
```

PNG and WebP also work in modern browsers if you update the filename in `data.js`.

For best performance, use properly compressed images around 1600–2400 px wide. Avoid uploading huge 10–20 MB originals directly.

### 5. What happens if a picture is missing?

Nothing breaks.

If, for example, `assets/cars/17.jpg` does not exist, the website automatically falls back to:

```text
assets/car-placeholder.svg
```

So you can add the photographs gradually.

## How to add more vehicles later

Add another object to the `CARS` array in `data.js`.

Example:

```js
{
  "id": 94,
  "make": "Porsche",
  "model": "911 GT3",
  "variant": "Touring / Carbon / BOSE",
  "registration": "06/2026",
  "year": 2026,
  "mileage": 1200,
  "mileageLabel": "1,200 km",
  "fuel": "Petrol",
  "body": "Coupe",
  "transmission": "Automatic",
  "power": "375 kW (510 PS)",
  "drive": "—",
  "color": "—",
  "price": 199900,
  "finalPrice": 219890,
  "image": "assets/cars/94.jpg",
  "features": ["Touring", "Carbon", "BOSE"],
  "tag": "IN STOCK"
}
```

Then add:

```text
assets/cars/94.jpg
```

No other JavaScript changes are needed.

## How to change the real contact email

There is one main place to change it.

Open:

```text
data.js
```

At the very top you will find:

```js
const CONTACT_EMAIL = "hello@autobridge.example";
```

Replace it with the real dealership email, for example:

```js
const CONTACT_EMAIL = "sales@yourdealership.com";
```

Save the file and refresh the website.

That single setting controls:

- the email shown in the Contact section
- the Contact section's `mailto:` link
- the email used by the "Enquire about this car" button on every vehicle detail page

You therefore do **not** need to edit every individual vehicle page.

## Important note about vehicle photos

The Excel inventory contains vehicle information, but it does not contain image files. This package therefore does not pretend that a particular online photo belongs to a particular vehicle.

The photo paths are prepared in `data.js`, and you can connect your real dealership photographs using the instructions above.

## File structure

```text
AutoBridge/
├── index.html
├── car.html
├── styles.css
├── app.js
├── data.js
├── README.md
└── assets/
    ├── favicon.svg
    ├── car-placeholder.svg
    └── cars/
        └── README.txt
```

## Quick checklist before publishing

- [ ] Replace `hello@autobridge.example` in `data.js`
- [ ] Add the correct photo for each vehicle in `assets/cars/`
- [ ] Open several vehicle detail pages and verify the photo/model match
- [ ] Check prices against your current inventory before publishing
- [ ] Test the contact buttons
- [ ] Test the site on mobile


## Multiple photos per car

Every vehicle now supports a photo gallery. In `data.js`, each car has an `images` array. The first image is the main/catalogue image, and every additional image appears as a thumbnail on the vehicle page.

Example for car #1:

```js
images: [
  "assets/cars/1-1.jpg",
  "assets/cars/1-2.jpg",
  "assets/cars/1-3.jpg",
  "assets/cars/1-4.jpg",
  "assets/cars/1-5.jpg"
]
```

Then create these files inside `assets/cars/`. The naming pattern is `<car-id>-<photo-number>.jpg`. For example, car 25 can have `25-1.jpg`, `25-2.jpg`, `25-3.jpg`, and as many more as you want.

You only need to edit `data.js` when adding photos. The website automatically provides the main image, thumbnail gallery, previous/next arrows, and photo count. If a listed photo is missing, the site shows the built-in placeholder instead of breaking.
