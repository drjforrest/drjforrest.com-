#!/bin/bash
# Publication File Renaming Script
# Edit the OLD_FILENAME variables below with your actual file names

# PDFs - Replace these with your actual filenames
OLD_PDF_1="YOUR_FILE_1.pdf"  # Effect of early treatment with fluvoxami...
if [ -f "$OLD_PDF_1" ]; then
    mv "$OLD_PDF_1" "effect-of-early-treatment-with-fluvoxamine-on-risk-of-emergency-care-and-hospitalisation-among-patients-with-covid-19.pdf"
    echo "✅ Renamed PDF 1: effect-of-early-treatment-with-fluvoxamine-on-risk-of-emergency-care-and-hospitalisation-among-patients-with-covid-19.pdf"
fi

OLD_PDF_2="YOUR_FILE_2.pdf"  # Effect of early treatment with ivermecti...
if [ -f "$OLD_PDF_2" ]; then
    mv "$OLD_PDF_2" "effect-of-early-treatment-with-ivermectin-among-patients-with-covid-19.pdf"
    echo "✅ Renamed PDF 2: effect-of-early-treatment-with-ivermectin-among-patients-with-covid-19.pdf"
fi

OLD_PDF_3="YOUR_FILE_3.pdf"  # Validating a shortened depression scale ...
if [ -f "$OLD_PDF_3" ]; then
    mv "$OLD_PDF_3" "validating-a-shortened-depression-scale-10-item-ces-d-among-hiv-positive-people-in-british-columbia-canada.pdf"
    echo "✅ Renamed PDF 3: validating-a-shortened-depression-scale-10-item-ces-d-among-hiv-positive-people-in-british-columbia-canada.pdf"
fi

OLD_PDF_4="YOUR_FILE_4.pdf"  # Interventions to improve adherence to an...
if [ -f "$OLD_PDF_4" ]; then
    mv "$OLD_PDF_4" "interventions-to-improve-adherence-to-antiretroviral-therapy-a-systematic-review-and-network-meta-analysis.pdf"
    echo "✅ Renamed PDF 4: interventions-to-improve-adherence-to-antiretroviral-therapy-a-systematic-review-and-network-meta-analysis.pdf"
fi

OLD_PDF_5="YOUR_FILE_5.pdf"  # A real-time dashboard of clinical trials...
if [ -f "$OLD_PDF_5" ]; then
    mv "$OLD_PDF_5" "a-real-time-dashboard-of-clinical-trials-for-covid-19.pdf"
    echo "✅ Renamed PDF 5: a-real-time-dashboard-of-clinical-trials-for-covid-19.pdf"
fi

OLD_PDF_6="YOUR_FILE_6.pdf"  # Early treatment with pegylated interfero...
if [ -f "$OLD_PDF_6" ]; then
    mv "$OLD_PDF_6" "early-treatment-with-pegylated-interferon-lambda-for-covid-19.pdf"
    echo "✅ Renamed PDF 6: early-treatment-with-pegylated-interferon-lambda-for-covid-19.pdf"
fi

OLD_PDF_7="YOUR_FILE_7.pdf"  # HIV care continuum in Rwanda...
if [ -f "$OLD_PDF_7" ]; then
    mv "$OLD_PDF_7" "hiv-care-continuum-in-rwanda-a-cross-sectional-analysis-of-the-national-programme.pdf"
    echo "✅ Renamed PDF 7: hiv-care-continuum-in-rwanda-a-cross-sectional-analysis-of-the-national-programme.pdf"
fi

OLD_PDF_8="YOUR_FILE_8.pdf"  # Mobile health applications for HIV preve...
if [ -f "$OLD_PDF_8" ]; then
    mv "$OLD_PDF_8" "mobile-health-applications-for-hiv-prevention-and-care-in-africa.pdf"
    echo "✅ Renamed PDF 8: mobile-health-applications-for-hiv-prevention-and-care-in-africa.pdf"
fi

# Thumbnails - Replace these with your actual filenames
OLD_THUMB_1="YOUR_THUMBNAIL_1.jpg"  # Effect of early treatment with fluvoxami...
if [ -f "$OLD_THUMB_1" ]; then
    mv "$OLD_THUMB_1" "effect-of-early-treatment-with-fluvoxamine-on-risk-of-emergency-care-and-hospitalisation-among-patients-with-covid-19.jpg"
    echo "✅ Renamed thumbnail 1: effect-of-early-treatment-with-fluvoxamine-on-risk-of-emergency-care-and-hospitalisation-among-patients-with-covid-19.jpg"
fi

OLD_THUMB_2="YOUR_THUMBNAIL_2.jpg"  # Effect of early treatment with ivermecti...
if [ -f "$OLD_THUMB_2" ]; then
    mv "$OLD_THUMB_2" "effect-of-early-treatment-with-ivermectin-among-patients-with-covid-19.jpg"
    echo "✅ Renamed thumbnail 2: effect-of-early-treatment-with-ivermectin-among-patients-with-covid-19.jpg"
fi

OLD_THUMB_3="YOUR_THUMBNAIL_3.jpg"  # Validating a shortened depression scale ...
if [ -f "$OLD_THUMB_3" ]; then
    mv "$OLD_THUMB_3" "validating-a-shortened-depression-scale-10-item-ces-d-among-hiv-positive-people-in-british-columbia-canada.jpg"
    echo "✅ Renamed thumbnail 3: validating-a-shortened-depression-scale-10-item-ces-d-among-hiv-positive-people-in-british-columbia-canada.jpg"
fi

OLD_THUMB_4="YOUR_THUMBNAIL_4.jpg"  # Interventions to improve adherence to an...
if [ -f "$OLD_THUMB_4" ]; then
    mv "$OLD_THUMB_4" "interventions-to-improve-adherence-to-antiretroviral-therapy-a-systematic-review-and-network-meta-analysis.jpg"
    echo "✅ Renamed thumbnail 4: interventions-to-improve-adherence-to-antiretroviral-therapy-a-systematic-review-and-network-meta-analysis.jpg"
fi

OLD_THUMB_5="YOUR_THUMBNAIL_5.jpg"  # A real-time dashboard of clinical trials...
if [ -f "$OLD_THUMB_5" ]; then
    mv "$OLD_THUMB_5" "a-real-time-dashboard-of-clinical-trials-for-covid-19.jpg"
    echo "✅ Renamed thumbnail 5: a-real-time-dashboard-of-clinical-trials-for-covid-19.jpg"
fi

OLD_THUMB_6="YOUR_THUMBNAIL_6.jpg"  # Early treatment with pegylated interfero...
if [ -f "$OLD_THUMB_6" ]; then
    mv "$OLD_THUMB_6" "early-treatment-with-pegylated-interferon-lambda-for-covid-19.jpg"
    echo "✅ Renamed thumbnail 6: early-treatment-with-pegylated-interferon-lambda-for-covid-19.jpg"
fi

OLD_THUMB_7="YOUR_THUMBNAIL_7.jpg"  # HIV care continuum in Rwanda...
if [ -f "$OLD_THUMB_7" ]; then
    mv "$OLD_THUMB_7" "hiv-care-continuum-in-rwanda-a-cross-sectional-analysis-of-the-national-programme.jpg"
    echo "✅ Renamed thumbnail 7: hiv-care-continuum-in-rwanda-a-cross-sectional-analysis-of-the-national-programme.jpg"
fi

OLD_THUMB_8="YOUR_THUMBNAIL_8.jpg"  # Mobile health applications for HIV preve...
if [ -f "$OLD_THUMB_8" ]; then
    mv "$OLD_THUMB_8" "mobile-health-applications-for-hiv-prevention-and-care-in-africa.jpg"
    echo "✅ Renamed thumbnail 8: mobile-health-applications-for-hiv-prevention-and-care-in-africa.jpg"
fi

echo "🎉 Renaming complete!"
