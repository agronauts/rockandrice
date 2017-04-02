import scrapy


# TODO Upgrade topython 3
# TODO Learn virtual env
# TODO Learn XPath
# TODO Change this to crag spider?
class CragSpider(scrapy.Spider):
    name = "crags"

    def start_requests(self):
        urls = [
            'http://climbnz.org.nz/nz/si/canterbury/banks-peninsula/the-monument',
            'http://climbnz.org.nz/nz/si/westland/charleston/south-of-deep-creek/the-nursery',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
            yield {
                'name': response.xpath('//title/text()').re_first('.+\|')[:-2],
                'description': '\n'.join(response.xpath("//div[contains(@class, 'description')]/p/text()").extract()),
            }
