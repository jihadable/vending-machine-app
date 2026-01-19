import { IconArrowLeft } from "@tabler/icons-react"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getIdDate } from "../helper/getIdDate"

export default function History(){
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        const getTransactions = async() => {
            try {
                const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
                const { data: productsData } = await axios.get(`${apiEndpoint}/products`)
                const { data: transactionsData } = await axios.get(`${apiEndpoint}/transactions`)

                const transactionWithProductDetail = transactionsData.map((transaction) => {
                    const product = productsData.find(product => product.id == transaction.product_id)

                    return {
                        id: transaction.id,
                        product,
                        date: transaction.date
                    }
                })

                setTransactions(transactionWithProductDetail)
            } catch(error){
                console.log(error)
            }
        }

        getTransactions()
    }, [])
    
    return (
        <section className="flex flex-col gap-8 items-center m-auto my-12 w-[80vw] mobile:w-full mobile:p-4 tablet:w-[90vw]">
            <h1 className="text-xl font-bold text-center">Riwayat Transaksi</h1>
            <Link to={"/"} className="self-start py-2 px-6 rounded-md flex items-center gap-2 bg-blue-400">
                <IconArrowLeft stroke={1.5} />
                <span>Halaman utama</span>
            </Link>
            <section className="w-full">
                <table className="w-full border border-gray-300 mt-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">No</th>
                            <th className="border px-4 py-2">Produk</th>
                            <th className="border px-4 py-2">Gambar</th>
                            <th className="border px-4 py-2">Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                {
                    transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2 text-center">{index + 1}</td>
                            <td className="border px-4 py-2">{transaction.product?.name || "-"}</td>
                            <td className="border px-4 py-2 text-center">
                            {
                                transaction.product?.image ? 
                                <img src={transaction.product.image} alt={transaction.product.name} className="w-16 h-16 object-cover mx-auto"/> : 
                                "-"
                            }
                            </td>
                            <td className="border px-4 py-2">{getIdDate(transaction.date)}</td>
                        </tr>
                    ))
                }
                    </tbody>
                </table>
            </section>
        </section>
    )
}