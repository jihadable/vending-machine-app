import { IconArrowLeft, IconEdit, IconPlus, IconSend, IconTrash, IconX } from "@tabler/icons-react"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { getIdentifier } from "../helper/getIdentifier"

export default function Admin(){
    const [products, setProducts] = useState([])

    useEffect(() => {
        const getProducts = async() => {
            try {
                const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
                const { data } = await axios.get(`${apiEndpoint}/products`)

                setProducts(data)
            } catch(error){
                console.log(error)
            }
        }

        getProducts()
    }, [])

    const handleDeleteProduct = async(productId) => {
        if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")){
            return
        }

        try {
            const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
            await axios.delete(`${apiEndpoint}/products/${productId}`)

            setProducts(products => products.filter(product => product.id != productId))
            toast.success("Berhasil menghapus produk")
        } catch(error){
            toast.success("Gagal menghapus produk")
            console.log(error)
        }
    }

    const [isShowAddProductForm, setIsShowAddProductForm] = useState(false)
    const [isShowUpdateProductForm, setIsShowUpdateProductForm] = useState(false)

    const [selectedProductToUpdate, setSelectedProductToUpdate] = useState({})
    const handleClickUpdateProductBtn = product => {
        setSelectedProductToUpdate(product)
        setIsShowUpdateProductForm(true)
    }
    
    return (
        <section className="flex flex-col gap-8 items-center m-auto my-12 w-[80vw] mobile:w-full mobile:p-4">
            <h1 className="text-xl font-bold">Halaman Admin</h1>
            <Link to={"/"} className="self-start py-2 px-6 rounded-md flex items-center gap-2 bg-blue-400">
                <IconArrowLeft stroke={1.5} />
                <span>Halaman utama</span>
            </Link>
            <section className="w-full flex flex-col">
                <div className="flex w-full items-end justify-between gap-4 mobile:flex-col mobile:items-start">
                    <h2 className="font-bold">Daftar Produk</h2>
                    <button type="button" className="py-2 px-6 rounded-md flex items-center gap-2 bg-blue-400" onClick={() => setIsShowAddProductForm(true)}>
                        <IconPlus stroke={1.5} />
                        <span>Tambah produk baru</span>
                    </button>
                </div>
                <section className="w-full mobile:overflow-x-auto">
                    <table className="w-full border border-gray-300 mt-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2">No</th>
                                <th className="border px-4 py-2">Nama</th>
                                <th className="border px-4 py-2">Gambar</th>
                                <th className="border px-4 py-2">Harga (Rp)</th>
                                <th className="border px-4 py-2">Stock</th>
                                <th className="border px-4 py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                    {
                        products.map((product, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2 text-center">{index + 1}</td>
                                <td className="border px-4 py-2">{product.name}</td>
                                <td className="border px-4 py-2 text-center">
                                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover mx-auto"/>
                                </td>
                                <td className="border px-4 py-2">{product.price}</td>
                                <td className="border px-4 py-2">{product.stock}</td>
                                <td className="border px-4 py-2">
                                    <div className="flex items-center">
                                        <button type="button" className="p-1 rounded-md bg-yellow-400" onClick={() => handleClickUpdateProductBtn(product)}>
                                            <IconEdit stroke={1.5} />
                                        </button>
                                        <button type="button" className="ml-2 p-1 rounded-md bg-red-500" onClick={() => handleDeleteProduct(product.id)}>
                                            <IconTrash stroke={1.5} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                        </tbody>
                    </table>
                </section>
            </section>
        {
            isShowAddProductForm &&
            <AddProductForm setIsShowAddProductForm={setIsShowAddProductForm} setProducts={setProducts} />
        }
        {
            isShowUpdateProductForm &&
            <UpdateProductForm setIsShowUpdateProductForm={setIsShowUpdateProductForm} selectedProductToUpdate={selectedProductToUpdate} setSelectedProductToUpdate={setSelectedProductToUpdate} setProducts={setProducts} />
        }
        </section>
    )
}

function AddProductForm({ setIsShowAddProductForm, setProducts }){
    const [nameInput, imageInput, priceInput, stockInput] = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ]
    
    const handleAddProduct = async(event) => {
        event.preventDefault()

        try {
            const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
            const { data } = await axios.post(`${apiEndpoint}/products`, {
                id: getIdentifier(),
                name: nameInput.current.value,
                image: imageInput.current.value,
                price: Number(priceInput.current.value),
                stock: Number(stockInput.current.value)
            })

            setProducts(products => [data, ...products])
            toast.success("Berhasil menambah produk")
            setIsShowAddProductForm(false)
        } catch(error){
            toast.error("Gagal menambah produk")
            console.log(error)
        }
    }
    
    return (
        <article className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 mobile:px-4">
            <form onSubmit={handleAddProduct} className="flex flex-col bg-[#f3f4f6] p-8 rounded-lg gap-4 w-1/2 relative mobile:w-full">
                <h2 className="font-bold">Tambah produk baru</h2>
                <div className="flex flex-col">
                    <label htmlFor="name-input" className="text-sm">Nama</label>
                    <input type="text" id="name-input" className="outline-none border-none p-2 bg-white rounded-md" required placeholder="Contoh: Teh Botol" ref={nameInput} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="image-input" className="text-sm">Gambar</label>
                    <input type="url" id="image-input" className="outline-none border-none p-2 bg-white rounded-md" required placeholder="Contoh: https://example.com/asset/product_image.webp" ref={imageInput} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="price-input" className="text-sm">Harga (Rp)</label>
                    <input type="number" id="price-input" min={1} className="outline-none border-none p-2 bg-white rounded-md" required placeholder="Contoh: 5000" ref={priceInput} />
                    </div>
                <div className="flex flex-col">
                    <label htmlFor="stock-input" className="text-sm">Stock</label>
                    <input type="number" id="stock-input" min={1} className="outline-none border-none p-2 bg-white rounded-md" required placeholder="Contoh: 100" ref={stockInput} />
                </div>
                <button type="submit" className="py-2 px-6 rounded-md flex items-center justify-center gap-2 bg-blue-400">
                    <IconSend stroke={1.5} />
                    <span>Submit</span>
                </button>
                <button type="button" className="absolute flex items-center justify-center p-1 rounded-full -top-8 -right-8 bg-white mobile:-top-10 mobile:right-0" onClick={() => setIsShowAddProductForm(false)}>
                    <IconX stroke={1.5} />
                </button>
            </form>
        </article>
    )
}

function UpdateProductForm({ setIsShowUpdateProductForm, selectedProductToUpdate, setSelectedProductToUpdate, setProducts }){
    const [nameInput, imageInput, priceInput, stockInput] = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ]
    
    const handleUpdateProduct = async(event) => {
        event.preventDefault()

        try {
            const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
            const { data } = await axios.put(`${apiEndpoint}/products/${selectedProductToUpdate.id}`, {
                name: nameInput.current.value,
                image: imageInput.current.value,
                price: Number(priceInput.current.value),
                stock: Number(stockInput.current.value)
            })

            setProducts(products => products.map(product => product.id == selectedProductToUpdate.id ? data : product))
            toast.success("Berhasil memperbarui produk")
            setIsShowUpdateProductForm(false)
            setSelectedProductToUpdate({})
        } catch(error){
            toast.error("Gagal memperbarui produk")
            console.log(error)
        }
    }
    
    return (
        <article className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 mobile:px-4">
            <form onSubmit={handleUpdateProduct} className="flex flex-col bg-[#f3f4f6] p-8 rounded-lg gap-4 w-1/2 relative mobile:w-full">
                <h2 className="font-bold">Perbarui data produk</h2>
                <div className="flex flex-col">
                    <label htmlFor="name-input" className="text-sm">Nama</label>
                    <input type="text" id="name-input" className="outline-none border-none p-2 bg-white rounded-md" required placeholder="Contoh: Teh Botol" defaultValue={selectedProductToUpdate.name} ref={nameInput} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="image-input" className="text-sm">Gambar</label>
                    <input type="url" id="image-input" className="outline-none border-none p-2 bg-white rounded-md" required placeholder="Contoh: https://example.com/asset/product_image.webp" defaultValue={selectedProductToUpdate.image} ref={imageInput} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="price-input" className="text-sm">Harga (Rp)</label>
                    <input type="number" id="price-input" min={1} className="outline-none border-none p-2 bg-white rounded-md" required placeholder="Contoh: 5000" defaultValue={selectedProductToUpdate.price} ref={priceInput} />
                    </div>
                <div className="flex flex-col">
                    <label htmlFor="stock-input" className="text-sm">Stock</label>
                    <input type="number" id="stock-input" min={1} className="outline-none border-none p-2 bg-white rounded-md" required placeholder="Contoh: 100" defaultValue={selectedProductToUpdate.stock} ref={stockInput} />
                </div>
                <button type="submit" className="py-2 px-6 rounded-md flex items-center justify-center gap-2 bg-blue-400">
                    <IconSend stroke={1.5} />
                    <span>Submit</span>
                </button>
                <button type="button" className="absolute flex items-center justify-center p-1 rounded-full -top-8 -right-8 bg-white mobile:-top-10 mobile:right-0" onClick={() => setIsShowUpdateProductForm(false)}>
                    <IconX stroke={1.5} />
                </button>
            </form>
        </article>
    )
}