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

convert_all_sizes $REPO_ROOT/src/assets/icons/green.svg
convert_all_sizes $REPO_ROOT/src/assets/icons/red.svg
convert_all_sizes $REPO_ROOT/src/assets/icons/yellow.svg
convert_all_sizes $REPO_ROOT/src/assets/icons/transparent.svg
