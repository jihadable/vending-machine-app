import { IconCancel, IconCash, IconCashPlus, IconHistory } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getIdCurrency } from "../helper/getIdCurrency";
import { getIdentifier } from "../helper/getIdentifier";

export default function Home(){
    const [products, setProducts] = useState([])
    const [balance, setBalance] = useState(0)
    const nominals = [2000, 5000, 10000, 20000, 50000]
    const [isShowNominalMenu, setIsShowNominalMenu] = useState(false)

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

    const handleInsertMoney = nominal => {
        setBalance(balance => balance + nominal)
        setIsShowNominalMenu(false)
    }

    const handleCancel = () => {
        toast.info(`Berhasil membatalkan. Uang ${getIdCurrency(balance)} dikembalikan`)
        setBalance(0)
    }

    const handleTransaction = async(product) => {
        if (balance < product.price){
            toast.warn("Uang yang Anda masukkan tidak mencukupi")

            return
        }

        try {
            const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
            const { data } = await axios.patch(`${apiEndpoint}/products/${product.id}`, {
                stock: product.stock - 1
            })

            setProducts(products => products.map(p => p.id == product.id ? data : p))

            await axios.post(`${apiEndpoint}/transactions`, {
                id: getIdentifier(),
                product_id: product.id,
                date: new Date()
            })

            setBalance(0)

            const change = balance - product.price

            if (change == 0){
                toast.success("Pembelian berhasil")
            } else if (change > 0){
                toast.success(`Pembelian berhasil. Uang kembalian Anda: ${getIdCurrency(change)}`)
            }
        } catch(error){
            toast.error("Gagal melakukan transaksi")
            console.log(error)
        }
    }

    return (
        <section className="flex flex-col gap-8 items-center m-auto my-12 w-1/3 mobile:w-full mobile:p-4">
            <h1 className="text-xl font-bold text-center">Vending Machine App</h1>
            <section className="products w-full grid grid-cols-3 gap-2 mobile:grid-cols-2">
            {
                products?.map((product, index) => (
                    <article className="product flex flex-col items-center rounded-md overflow-hidden border-gray-200 border relative" key={index}>
                        <div className="img flex">
                            <img src={product.image} alt={product.name} className="w-full" />
                        </div>
                        <div className="desc w-full flex flex-col gap-2 p-2">
                            <p className="name font-bold">{product.name}</p>
                            <p className="price">{getIdCurrency(product.price)}</p>
                            <p className="stock text-sm self-end">Stock: {product.stock}</p>
                        </div>
                    {
                        balance > 0 && product.stock > 0 &&
                        <button type="button" className="absolute top-1/3 left-0 right-0 p-2 bg-blue-400 flex items-center justify-center gap-2" onClick={() => handleTransaction(product)}>
                            <IconCash stroke={1.5} />
                            <span>Beli</span>
                        </button>
                    }
                    </article>
                ))
            }
            </section>
            <article className="relative">
                <button type="button" className="py-2 px-6 rounded-md flex items-center gap-2 bg-blue-400" onClick={() => setIsShowNominalMenu(true)}>
                    <IconCashPlus stroke={1.5} />
                    <span>Masukkan uang</span>
                </button>
                <article className={`nominals min-w-full ${isShowNominalMenu ? "flex" : "hidden"} flex-col py-2 rounded-md absolute bottom-[110%] bg-white shadow-2xl`}>
                    <h2 className="font-bold p-2">Pilih pecahan:</h2>
                    <article className="flex flex-col">
                    {
                        nominals.map((nominal, index) => (
                            <button type="button" className="p-2 text-left hover:bg-black/10" key={index} onClick={() => handleInsertMoney(nominal)}>{getIdCurrency(nominal)}</button>
                        ))
                    }
                    </article>
                </article>
            </article>
            <article className="balance">Uang yang Anda masukkan: {getIdCurrency(balance)}</article>
        {
            balance > 0 &&
            <button type="button" className="py-2 px-6 rounded-md flex items-center gap-2 bg-red-400" onClick={handleCancel}>
                <IconCancel stroke={1.5} />
                <span>Batalkan</span>
            </button>
        }
            <Link to={"/history"} className="self-end py-2 px-6 rounded-md flex items-center gap-2 bg-blue-400">
                <IconHistory stroke={1.5} />
                <span>Riwayat transaksi</span>
            </Link>
        </section>
    )
}