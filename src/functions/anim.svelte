<script>
    	function mouseR() {
		let pointerBox = buttonPointer.getBoundingClientRect();
		let centerPoint = getClientStyle(buttonPointer);
		let centers = centerPoint[0].split(" ");
		let centerY = pointerBox.top + parseInt(centers[1]) - centerPoint[1];
		let centerX = pointerBox.left + parseInt(centers[0]) - centerPoint[2];
		let radians = Math.atan2(e.clientX - centerX, e.clientY - centerY);
		pointerRotation.update((n) => radians * (180 / Math.PI) * -1);
		coordsY.update((n) => e.clientY);
		coordsX.update((n) => e.clientX);
		//coords.set({ x: e.clientX, y: e.clientY });
	}
</script>