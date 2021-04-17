//draws label and subattributes
function drawLabel(start, end, dep, labelText, type) {
    console.log("drew label");
    console.log(dep);

    ctx.fillStyle = "white";                                        //add color based on attribute

    //draw empty label with border
    ctx.beginPath();
    ctx.rect(((start + end) / 2) - (width / 2), dep, width, height);
    ctx.fill();

    //draw text inside label
    ctx.font = (height / 2) + "px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText(labelText, ((start + end) / 2), dep + (height / 2), width);

    //draw lines to connect to children
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.7;

    for (let i = 0; i < type.length; i++) {
        //setting start and end of child
        var tmp_start = start + ((end - start) / type.length) * i;
        var tmp_end = tmp_start + ((end - start) / type.length);

        //drawing line to child
        ctx.beginPath();
        ctx.moveTo(((start + end) / 2), dep + height);
        ctx.lineTo(((tmp_start + tmp_end) / 2), dep + (height * 3));
        ctx.stroke();
        ctx.closePath();

        //adding subattribute "label"
        ctx.fillStyle = "#4C4C4C";
        var new_start = (((start + end) / 2) + (((tmp_start + tmp_end) / 2))) / 2;                  //finds middle between label and its child
        ctx.rect(new_start - (width / 8), dep + (2 * height) - (height / 8), width / 4, height / 4);
        ctx.fill();

        ctx.fillStyle = "#000000";
        ctx.font = (height / 4) + "px Georgia";
        ctx.fillText(type[i], new_start, dep + (2 * height), width / 4);
    }
}

//add decision (yes/no) label
function drawDecision(start, end, dep, text, childrenLength, index) {
    //setting start and end of decision lable partition
    var tmp_start = start + ((end - start) / childrenLength) * index;
    var tmp_end = tmp_start + ((end - start) / childrenLength);

    //drawing circle
    ctx.beginPath();
    ctx.arc(((tmp_start + tmp_end) / 2), dep + (7 * height / 2), height / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();

    //adding text
    ctx.fillStyle = "#000000";
    ctx.fillText(text, ((tmp_start + tmp_end) / 2), dep + (7 * height / 2), height / 2);
    ctx.closePath();
}