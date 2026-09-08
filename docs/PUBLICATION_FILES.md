# Publication Files System

This document explains the systematic file naming convention for your publications.

## 📁 Directory Structure

```
src/public/pdf/
├── thumbnails/          # Publication thumbnail images
└── [publication files]  # PDF files
```

## 🏷️ Naming Convention

**Format**: `{publication-slug}.{extension}`

All files use the same base filename (the publication slug) with different extensions:
- PDFs: `{slug}.pdf`
- Thumbnails: `{slug}.jpg` (or `.png`)

## 📋 File List

### PDFs (place in `/src/public/pdf/`)

1. `effect-of-early-treatment-with-fluvoxamine-on-risk-of-emergency-care-and-hospitalisation-among-patients-with-covid-19.pdf`
2. `effect-of-early-treatment-with-ivermectin-among-patients-with-covid-19.pdf`
3. `validating-a-shortened-depression-scale-10-item-ces-d-among-hiv-positive-people-in-british-columbia-canada.pdf`
4. `interventions-to-improve-adherence-to-antiretroviral-therapy-a-systematic-review-and-network-meta-analysis.pdf`
5. `a-real-time-dashboard-of-clinical-trials-for-covid-19.pdf`
6. `early-treatment-with-pegylated-interferon-lambda-for-covid-19.pdf`
7. `hiv-care-continuum-in-rwanda-a-cross-sectional-analysis-of-the-national-programme.pdf`
8. `mobile-health-applications-for-hiv-prevention-and-care-in-africa.pdf`

### Thumbnails (place in `/src/public/pdf/thumbnails/`)

1. `effect-of-early-treatment-with-fluvoxamine-on-risk-of-emergency-care-and-hospitalisation-among-patients-with-covid-19.jpg`
2. `effect-of-early-treatment-with-ivermectin-among-patients-with-covid-19.jpg`
3. `validating-a-shortened-depression-scale-10-item-ces-d-among-hiv-positive-people-in-british-columbia-canada.jpg`
4. `interventions-to-improve-adherence-to-antiretroviral-therapy-a-systematic-review-and-network-meta-analysis.jpg`
5. `a-real-time-dashboard-of-clinical-trials-for-covid-19.jpg`
6. `early-treatment-with-pegylated-interferon-lambda-for-covid-19.jpg`
7. `hiv-care-continuum-in-rwanda-a-cross-sectional-analysis-of-the-national-programme.jpg`
8. `mobile-health-applications-for-hiv-prevention-and-care-in-africa.jpg`

## 🎯 Quick Reference

| Publication Title | Base Filename |
|-------------------|---------------|
| Effect of early treatment with fluvoxamine... | `effect-of-early-treatment-with-fluvoxamine-on-risk-of-emergency-care-and-hospitalisation-among-patients-with-covid-19` |
| Effect of early treatment with ivermectin... | `effect-of-early-treatment-with-ivermectin-among-patients-with-covid-19` |
| Validating a shortened depression scale... | `validating-a-shortened-depression-scale-10-item-ces-d-among-hiv-positive-people-in-british-columbia-canada` |
| Interventions to improve adherence to antiretroviral therapy... | `interventions-to-improve-adherence-to-antiretroviral-therapy-a-systematic-review-and-network-meta-analysis` |
| A real-time dashboard of clinical trials... | `a-real-time-dashboard-of-clinical-trials-for-covid-19` |
| Early treatment with pegylated interferon lambda... | `early-treatment-with-pegylated-interferon-lambda-for-covid-19` |
| HIV care continuum in Rwanda... | `hiv-care-continuum-in-rwanda-a-cross-sectional-analysis-of-the-national-programme` |
| Mobile health applications for HIV prevention... | `mobile-health-applications-for-hiv-prevention-and-care-in-africa` |

## ✅ Benefits of This System

- **Consistent**: Same naming pattern for all files
- **Automatic**: No manual URL updating needed
- **SEO-Friendly**: URLs match the actual content
- **Maintainable**: Easy to add new publications
- **Self-Contained**: All files are local to your project

## 🔄 How It Works

1. **URLs**: Each publication gets a clean URL like `/publications/effect-of-early-treatment-with-fluvoxamine-on-risk-of-emergency-care-and-hospitalisation-among-patients-with-covid-19`

2. **Files**: The system automatically looks for:
   - PDF: `/pdf/{slug}.pdf`
   - Thumbnail: `/pdf/thumbnails/{slug}.jpg`

3. **Fallback**: External URLs are preserved in `fullTextUrl` as backup links

## 📝 To Add Files

Simply drop your PDF and thumbnail files into the appropriate directories using the exact filenames listed above. The system will automatically serve them!