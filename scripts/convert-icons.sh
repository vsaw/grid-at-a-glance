REPO_ROOT=$(git rev-parse --show-toplevel)

convert_all_sizes () {
    # $1 input file
    INPUT_FILE=$1

    BASE=$(basename $INPUT_FILE)
    FILE_NAME="${BASE%.*}"
    OUT_FOLDER=$(dirname $INPUT_FILE)

    rsvg-convert --page-width=32 --page-height=32 --width 20 --top 6 --left 6 $INPUT_FILE > $OUT_FOLDER/$FILE_NAME.png
    rsvg-convert --page-width=64 --page-height=64 --width 40 --top 12 --left 12 $INPUT_FILE > $OUT_FOLDER/$FILE_NAME@2x.png
    rsvg-convert --page-width=160 --page-height=160 --width 100 --top 30 --left 30 $INPUT_FILE > $OUT_FOLDER/$FILE_NAME@5x.png
    rsvg-convert --page-width=256 --page-height=256 --width 160 --top 48 --left 48 $INPUT_FILE > $OUT_FOLDER/$FILE_NAME@8x.png
}

# Tray Icons
convert_all_sizes $REPO_ROOT/src/assets/icons/blue.svg
convert_all_sizes $REPO_ROOT/src/assets/icons/green.svg
convert_all_sizes $REPO_ROOT/src/assets/icons/red.svg
convert_all_sizes $REPO_ROOT/src/assets/icons/yellow.svg
convert_all_sizes $REPO_ROOT/src/assets/icons/transparent.svg

# App Icon
# MacOS app iconset
mkdir -p $REPO_ROOT/src/assets/icons/app.iconset
rsvg-convert --page-width=32 --page-height=32 --width 20 --top 6 --left 6 $REPO_ROOT/src/assets/icons/app.svg > $REPO_ROOT/src/assets/icons/app.iconset/icon_32x32.png
rsvg-convert --page-width=64 --page-height=64 --width 40 --top 12 --left 12 $REPO_ROOT/src/assets/icons/app.svg > $REPO_ROOT/src/assets/icons/app.iconset/icon_32x32@2x.png
rsvg-convert --page-width=128 --page-height=128 --width 80 --top 24 --left 24 $REPO_ROOT/src/assets/icons/app.svg > $REPO_ROOT/src/assets/icons/app.iconset/icon_128x128.png
rsvg-convert --page-width=256 --page-height=256 --width 160 --top 48 --left 48 $REPO_ROOT/src/assets/icons/app.svg > $REPO_ROOT/src/assets/icons/app.iconset/icon_128x128@2x.png
rsvg-convert --page-width=256 --page-height=256 --width 160 --top 48 --left 48 $REPO_ROOT/src/assets/icons/app.svg > $REPO_ROOT/src/assets/icons/app.iconset/icon_256x256.png
rsvg-convert --page-width=512 --page-height=512 --width 320 --top 96 --left 96 $REPO_ROOT/src/assets/icons/app.svg > $REPO_ROOT/src/assets/icons/app.iconset/icon_256x256@2x.png
rsvg-convert --page-width=512 --page-height=512 --width 320 --top 96 --left 96 $REPO_ROOT/src/assets/icons/app.svg > $REPO_ROOT/src/assets/icons/app.iconset/icon_512x512.png
rsvg-convert --page-width=1024 --page-height=1024 --width 640 --top 192 --left 192 $REPO_ROOT/src/assets/icons/app.svg > $REPO_ROOT/src/assets/icons/app.iconset/icon_512x512@2x.png
iconutil -c icns $REPO_ROOT/src/assets/icons/app.iconset/

# Linux app icon
rsvg-convert --page-width=1024 --page-height=1024 --width 640 --top 192 --left 192 $REPO_ROOT/src/assets/icons/app.svg > $REPO_ROOT/src/assets/icons/app.png

# Windows app icon
magick $REPO_ROOT/src/assets/icons/app.iconset/icon_32x32.png $REPO_ROOT/src/assets/icons/app.iconset/icon_32x32@2x.png $REPO_ROOT/src/assets/icons/app.iconset/icon_256x256.png $REPO_ROOT/src/assets/icons/app.ico