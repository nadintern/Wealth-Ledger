import PageHeader from "@/components/PageHeader";
import CryptoPortfolio from "@/components/CryptoPortfolio";

export default function PortfolioPage() {
    return (
        <>
            <PageHeader
                eyebrow="Holdings"
                title="Crypto Portfolio"
                description="Live spot prices for your tracked assets, valued in your preferred currency."
            />
            <CryptoPortfolio/>
        </>
    );
}
