import scrapy


# TODO Upgrade topython 3
# TODO Learn virtual env
# TODO Learn XPath
# TODO Change this to crag spider?
class CragSpider(scrapy.Spider):
    name = "crags"

    def start_requests(self):
        urls = [
            'http://climbnz.org.nz/crags',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for href in response.xpath('//div/ul/li/div/span/a/@href').extract():
            print(href)
            yield scrapy.Request(response.urljoin(href),
                                 callback=self.parse_crag)

    def parse_crag(self, response):
        yield {
                'name': response.xpath('//title/text()').re_first('.+\|')[:-2],
                'description': '\n'.join(response.xpath("//div[contains(@class, 'description')]/p/text()").extract()),
            }
