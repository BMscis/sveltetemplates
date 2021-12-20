<script>
    export const checkFocus = (content,range) => {
        //is there content inputed
        let isThereContent = false;
        //shoud dialog be pulled up
        let isPullupDialog = false;
        //set istherecontent
        content == null || undefined ? (isThereContent = false) : (isThereContent = true);
        //if there is content check if content is greater than or less than range
        if (isThereContent == true) {
            content >= range ? (isPullupDialog = false) : (isPullupDialog = true);
            content >= range ? (isInputOk = true) : (isInputOk = false);
        //else there is no content and input is not ol
        } else {
            isInputOk = false;
            isPullupDialog = false;
        }
        isPullupDialog ? (shouldPullupDialog = true) : (shouldPullupDialog = false);
        isThereContent ? (inputed = false) : (inputed = true);
    };
</script>
