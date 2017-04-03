from scrapy.loader import ItemLoader
from scrapy.loader.processors import Join, MapCompose

def parse_crag_name(raw_title):
    return raw_title.split(' |')[0]

class CragLoader(ItemLoader):

    # name_in = MapCompose(unicode.title) # Input processor
    name_out = MapCompose(parse_crag_name) # Output processor


