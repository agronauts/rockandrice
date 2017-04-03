import scrapy


# TODO Upgrade topython 3
# TODO Learn virtual env
# TODO Learn XPath
# TODO Change this to crag spider?
from scrapy.loader import ItemLoader

from climbdb.items import CragItem


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
            yield scrapy.Request(response.urljoin(href),
                                 callback=self.parse_crag)

    def parse_crag(self, response):
        l = ItemLoader(item=CragItem(), response=response)
        l.add_xpath('name', '//title/text()')
        l.add_xpath('description', "//div[contains(@class, 'description')]/p/text()")
        return l.load_item()

