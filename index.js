// keep table data for a moment
var arr = [];
// const arr = [
// 	{
// 		"nama": "Redmi",
// 		"ram": 2,
// 		"harga": 970000,
// 		"memory": 16,
// 		"processor": 4,
// 		"camera": 8,
// 	},
// 	{
// 		"nama": "Smartfren",
// 		"ram": 1,
// 		"harga": 999000,
// 		"memory": 8,
// 		"processor": 4,
// 		"camera": 8,
// 	},
// 	{
// 		"nama": "Lenovo",
// 		"ram": 2,
// 		"harga": 1700000,
// 		"memory": 16,
// 		"processor": 8,
// 		"camera": 8,
// 	},
// ]

const $ = require("lodash")

// Set value for each criteria
const criteria = {
    harga: 0.3,
    ram: 0.3,
    memory: 0.15,
    processor: 0.15,
    camera: 0.1,
}

// Get max value for benefit criteria and minimum value for cost criteria
function getMinMax(value) {
	const hargaMin = $.minBy(value, 'harga');
	const ramMax = $.maxBy(value, 'ram');
	const cameraMax = $.maxBy(value, 'camera');
	return {
		harga: hargaMin.harga,
		ram: ramMax.ram,
		camera: cameraMax.camera
	}
}

// Normalize value from benefit and cost criteria
function normalisasi(matrix, maxmin) {
	matrix.harga = maxmin.harga / matrix.harga;
	matrix.ram = matrix.ram / maxmin.ram;
	matrix.camera = matrix.camera /maxmin.camera;

	return matrix;
}

// Calculate the normalize value with criteria value
function hitungPeringkat(nilai) {
	const total = (nilai.harga * criteria.harga) + (nilai.ram * criteria.ram) + (nilai.camera * criteria.camera); 
	const result = {
		nama: nilai.nama,
		total: total
	}
	return result;
}


let rupiah = document.getElementById('harga');

rupiah.addEventListener('keyup', function(e){
    rupiah.value = formatRupiah(this.value, 'Rp. ');
});

function formatRupiah(angka, prefix){
    var number_string = angka.replace(/[^,\d]/g, '').toString(),
    split   		= number_string.split(','),
    sisa     		= split[0].length % 3,
    rupiah     		= split[0].substr(0, sisa),
    ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if(ribuan){
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}


document.getElementById("submit-btn").addEventListener("click",function(e){
    
    let nama = document.getElementById("nama");
    let ram = document.getElementById("ram");
    let harga = document.getElementById("harga");
    let camera = document.getElementById("camera");
    
    // Remove 'Rp.' and all '.'
    let fix_harga = harga.value.toString().replace("Rp.","").replace(/\./g,"");

    const obj = {
        "nama":nama.value,
        "ram":parseInt(ram.value),
        "harga":parseInt(fix_harga),
        "camera":parseInt(camera.value)
    }
    
    // empty all input text
    nama.value = "";
    ram.value = "";
    harga.value = "";
    camera.value = "";

    // Add a new row in table and push object to data

    let table = document.getElementById("dt-body");
    let child = document.createElement("tr");

    let txt = "<tr>"
    +"<td>"+obj.nama+"</td>"
    +"<td>"+obj.ram+"</td>"
    +"<td>"+obj.harga+"</td>"
    +"<td>"+obj.camera+"</td>"
    +"</tr>"

    child.innerHTML = txt;
    table.appendChild(child);
    arr.push(obj)

    // Make the table visible
    document.getElementById("result-div").className = "container text-center";
})

document.getElementById("decide-btn").addEventListener("click",function(e){

    if(arr.length < 1){
        alert("Add Products First before System Make a Decision!")
        return
    }

    // Disabled the button
    this.className = "btn btn-disabled";
    this.innerHTML = "Processing...";

    // Copy array, using the same array can cause diffrent result which is annoying...

    // Processing Simple Additive Weighting Method
    let getMaxMin = getMinMax(arr)
    let normalisasiNilai = $.map(arr,nilai => normalisasi(nilai,getMaxMin))
    let hitungBobotPeringkat = $.map(normalisasiNilai,nilai => hitungPeringkat(nilai))

    alert("The System Recommend "+$.maxBy(hitungBobotPeringkat,"total")["nama"]+" as the Best Option");

    // Empty Array
    while(arr.length > 0){
        arr.pop();
    }

    this.className = "btn btn-primary";
    this.innerHTML = "Pick Best Option Here!";
    document.getElementById("dt-body").innerHTML = "";
})