import {ImageResponse} from 'next/og';
import {getMemecoin} from "@/lib/memecoin.actions";

export const size = {width: 1200, height: 630} as const;
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: { id: string } }) {
    const id = params.id;
    const coin = await getMemecoin(id);
    return new ImageResponse(
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: '#fff',
            fontSize: 48,
            fontWeight: 700,
        }}>
            {coin.logoUrl &&
                <img src={coin.logoUrl} alt="logo" width={120} height={120} style={{borderRadius: '9999px'}}/>}
            <span style={{marginTop: 32}}>{coin.name}</span>
        </div>
    );
}
