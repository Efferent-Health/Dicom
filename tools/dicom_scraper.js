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
    const tableMatch = html.match(/<table[^>]*>[\s\S]*?<\/table>/i);

    if (!tableMatch) {
        console.error('No table found in the HTML.');
        return '';
    }

    const rows = ["tag,VR,VM,description"];
    const tableHtml = tableMatch[0];
    const tbodyMatch = tableHtml.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
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

async function scrapeDicomDictionary()
{
    const url = 'https://www.dicomstandard.org/standards/view/data-dictionary#chapter_6';

    try {
        const response = await fetch(url);

        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

        const html = await response.text();
        const csv = tableToCsv(html);

        if (csv) {
console.log(`namespace Efferent
{
    export const DICOM_DICT = \`
${csv}\`;
}`);
        }
    } catch (error) {
        console.error('Error fetching or parsing the page:', error.message);
    }
}

scrapeDicomDictionary();