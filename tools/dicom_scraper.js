// Official DICOM dictionary generator (compressed)
// Source: https://www.dicomstandard.org/standards/view/data-dictionary#chapter_6
// Run: node dicom_scraper.js >../src/DictionarySource.ts

function compressRelative(older, prev, curr)
{
    if (!prev)
        return curr;  

    const oldWords = older.split(/\s+/);
    const prevWords = prev.split(/\s+/);
    const currWords = curr.split(/\s+/);

    return currWords
        .map(word => {
            const index = prevWords.indexOf(word);
            return index >= 0 ? `$${index + 1}` : word;
        })
        .map(word => {
            const index = oldWords.indexOf(word);
            return index >= 0 ? `%${index + 1}` : word;
        })
        .join(" ");
}

function tableToCsv(html)
{
    const anchorMatch = html.match(/<a[^>]+(name|id)=["']([^"']+)["'][^>]*>[\s\S]*?(<table[\s\S]*?<\/table>)/i);
    // This match is replaced by logic to find table by anchor, but since anchor is dynamic, we do below:

    // The anchor string is passed in scrapeDicomDictionary, so here we need to find the table by anchor.
    // We'll move this logic to scrapeDicomDictionary to pass the correct tableHtml to tableToCsv.

    // Since we removed tableIndex, we will find the table in scrapeDicomDictionary and pass the html of the table only.
    // So tableToCsv now expects the html of the table only.

    const rows = [];
    const tbodyMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
    const groups = [ "0002", "0008", "0010", "0018", "0020", "0028", "0032", "0038", "0040", "5200", "7FE0" ]

    var descr, tag, vr, vm, group;
    var prevDesc = "";
    var prevTag = "";
    var prevVR = "";
    var older = "";

    if (tbodyMatch) {
        const bodyRows = tbodyMatch[1].match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
        if (bodyRows) {
            bodyRows.some(row => {
                const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);

                if (cells)
                {
                    const rowData = cells.map(cell => {
                        return cell.replace(/<[^>]+>/g, '').trim().replace(/"/g, '""');
                    });

                    group = rowData[0].substring(1, 5);

                    if (!groups.includes(group) || !rowData[3])
                        return false;

                    descr = compressRelative(older, prevDesc, rowData[1]);
                    older = prevDesc;
                    prevDesc = rowData[1];

                    tag = group == prevTag.substring(1, 5) ?
                        rowData[0].replace(/^\((.{4}),0*(.+)\)$/, "$2") :
                        rowData[0].replace(/^\((.{4}),(.{4})\)$/, "$1$2");
                    prevTag = rowData[0];
                    
                    vr = rowData[3].replaceAll(" or ", "/");
                    vr = vr == prevVR ? "" : vr;
                    prevVR = vr === "" ? prevVR : vr;

                    vm = rowData[4] === "1" ? "" : rowData[4].replaceAll(" or ", "/");

                    rows.push(`${tag},${vr},${vm},${descr}` );

                    return false;
                }
            });
        }
    }

    return rows.join('\n');
}

async function scrapeDicomDictionary(url)
{
    try {
        const response = await fetch(url);

        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

        const html = await response.text();

        const anchorMatch = url.match(/#(.+)$/);
        const anchor = anchorMatch ? anchorMatch[1] : null;

        if (!anchor) {
            console.error('No anchor found in URL.');
            return;
        }

        const regex = new RegExp(`(<a[^>]+(?:name|id)=["']${anchor}["'][^>]*>)[\\s\\S]*?(<table[\\s\\S]*?<\\/table>)`, 'i');
        const match = html.match(regex);
        if (!match) {
            console.error(`No table found for anchor: ${anchor}`);
            return;
        }
        const tableHtml = match[2];

        const csv = tableToCsv(tableHtml);

        if (csv) {
            console.log(csv);
        }
    } catch (error) {
        console.error('Error fetching or parsing the page:', error.message);
    }
}

console.log(`namespace Efferent
{
    export const DICOM_DICT = \`
tag,VR,VM,description`);

await scrapeDicomDictionary('https://www.dicomstandard.org/standards/view/data-dictionary#chapter_7');
await scrapeDicomDictionary('https://www.dicomstandard.org/standards/view/data-dictionary#chapter_6');

console.log(`\`;
}`);